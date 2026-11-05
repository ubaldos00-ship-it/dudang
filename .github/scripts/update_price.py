#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
다봄(여기고기) 소 산지가격 자동수집 — 최근 발행일을 찾아 prices.json에 추가.
GitHub Actions에서 매 평일 실행. 외부 라이브러리 없이 표준 라이브러리만 사용.

※ 다봄은 1~2일 지연 발행이라 '오늘'은 아직 값이 없는 경우가 많다.
  그래서 오늘부터 최대 LOOKBACK일까지 거슬러 올라가며 '금일' 행에
  실제 값이 있는 날을 찾아 그 날짜로 저장한다. 이미 있으면 값만 갱신(idempotent).
"""
import re, json, os, sys, urllib.request, html as H
from datetime import datetime, timezone, timedelta

LOOKBACK = 8   # 오늘부터 며칠까지 거슬러 찾을지(주말·공휴일·지연 대비)

KEYS = ['largeCow600kg','femaleCalf4to5','maleCalf4to5','femaleCalf6to7',
        'maleCalf6to7','hanwooAverage600kg','hanwooSteer600kg',
        'hanwooBull600kg','beefCattleAverage600kg']
URL = "https://www.ekapepia.com/v3/price/livestock/cow/producer.do?searchDate={}"
PRICE_FILE = os.environ.get("PRICE_FILE", "data/cattle_price/prices.json")

def fetch(d):
    req = urllib.request.Request(URL.format(d), headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=20) as r:
        return r.read().decode('utf-8', 'ignore')

def parse(t):
    m = re.search(r'금일.*?</tr>', t, re.S)
    if not m:
        return None, None
    tds = re.split(r'<td', m.group(0))[1:]
    if len(tds) < 9:
        return None, None
    vals = []
    for td in tds[:9]:
        txt = H.unescape(re.sub(r'<[^>]+>', ' ', td))
        nums = re.findall(r'[0-9][0-9,]*', txt)
        v = int(nums[0].replace(',', '')) if nums else None
        vals.append(v if v else None)          # 0 → null
    upd = re.search(r'최종 업데이트\s*:\s*([0-9]{4}-[0-9]{2}-[0-9]{2})', t)
    return dict(zip(KEYS, vals)), (upd.group(1) if upd else None)

def main():
    kst = datetime.now(timezone(timedelta(hours=9)))

    # 오늘부터 거슬러 올라가며 '금일' 행에 값이 있는 최근 발행일을 찾는다.
    found = {}   # {날짜: prices}
    for i in range(LOOKBACK):
        d = (kst - timedelta(days=i)).strftime('%Y-%m-%d')
        prices, _ = parse(fetch(d))
        if prices and any(v is not None for v in prices.values()):
            found[d] = prices
            # 가장 최근 발행일 1건만 있으면 충분하지만,
            # 혹시 아직 안 들어온 직전 발행일도 함께 보강(최대 3건까지)
            if len(found) >= 3:
                break
    if not found:
        print(f"[skip] 최근 {LOOKBACK}일 내 발행 자료 없음. 변경 없음.")
        return 0

    doc = json.load(open(PRICE_FILE, encoding='utf-8'))
    data = doc.setdefault('data', {})
    for key, prices in found.items():
        data[key] = {"prices": {k: {"price": prices[k], "previousPrice": None} for k in KEYS}}

    # 연대순 정렬 + previousPrice(직전 수록일 가격) 재계산
    dates = sorted(data.keys())
    prev = {k: None for k in KEYS}
    for ds in dates:
        pr = data[ds]['prices']
        for k in KEYS:
            if k not in pr:
                pr[k] = {"price": None, "previousPrice": None}
            pr[k]['previousPrice'] = prev[k]
            if pr[k].get('price') is not None:
                prev[k] = pr[k]['price']
    doc['data'] = {ds: data[ds] for ds in dates}
    doc['latestDate'] = dates[-1]
    doc['updatedAt'] = kst.strftime('%Y-%m-%dT%H:%M:%S+09:00')

    json.dump(doc, open(PRICE_FILE, 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    latest = max(found.keys())
    print(f"[ok] 발행일 {sorted(found.keys())} 반영 · 최신 {latest} "
          f"한우거세={found[latest]['hanwooSteer600kg']} / 총 {len(dates)}일")
    return 0

if __name__ == "__main__":
    sys.exit(main())
