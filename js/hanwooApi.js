/* hanwooApi.js · 두당 頭當 · 한우AI OpenAPI 연동 모듈 (화면코드와 분리)
   저장: 2026-09-25 07:27 KST (v1)

   ⚠️ 보안 원칙
   - GitHub Pages(브라우저)에서 한우AI API를 직접 호출하지 않습니다.
   - 반드시 AWS API Gateway → Lambda 중계를 거칩니다.
   - 개발키(인증키)는 HTML/JS/config 어디에도 넣지 않습니다. AWS 서버(환경변수)에서만 관리합니다.

   ⚠️ 필드명 원칙
   - 실제 응답 필드명은 개발키로 실호출해 확인하기 전까지 확정하지 않습니다.
   - 아래 FIELD_CANDIDATES 는 "후보" 목록이며, 실제 필드명이 확인되면 맨 앞에 추가/정정하세요.
   - 확인 전에는 추측 필드명을 단정하지 않고, 원본(_raw)을 함께 보관해 검증할 수 있게 합니다.

   향후 확장: 같은 모듈에 다른 한우 API 함수를 추가합니다(예: 개체 기본이력 등). */
(function (global) {
  "use strict";

  // ── 환경설정 : AWS(API Gateway/Lambda) 배포 후 아래 주소만 입력 ──
  // 예: "https://xxxx.execute-api.ap-northeast-2.amazonaws.com/prod/hanwoo/inseminations"
  var RELAY_URL = "https://6cyqrrkkot7lmux7mwiwhrip4y0fhtow.lambda-url.ap-northeast-2.on.aws/";  // AWS Lambda 함수 URL(중계). 비우면 '연동 준비 중'
  var REQUEST_TIMEOUT_MS = 12000;  // 한우AI 서버 응답이 느릴 수 있어 여유(7080 포트)

  // 응답 정규화용 필드명. ✅ 2026-09-25 실호출로 확인됨: insemDate / kpnNo / rowRank (배열은 data[])
  var FIELD_CANDIDATES = {
    date: ["insemDate", "aiDate", "insem_date", "seedDate", "fertDate", "insemYmd", "date"],
    kpn:  ["kpnNo", "kpn_no", "kpnNm", "semenNo", "bullNo", "seedBullNo", "kpn"],
    rank: ["rowRank", "rank", "insemRank", "seq", "order", "rowNum"]
  };

  // ── 개체번호 정규화 ──
  // 규칙: 공백/하이픈 등 제거 → 숫자만. 15자리(410+12)면 앞 410 제거. 최종 12자리 숫자여야 함.
  function normalizeChiNo(raw) {
    if (raw == null) return { ok: false, reason: "empty" };
    var digits = String(raw).replace(/[^0-9]/g, "");
    if (!digits) return { ok: false, reason: "empty" };
    // 410 접두 15자리 → 12자리로
    if (digits.length === 15 && digits.slice(0, 3) === "410") digits = digits.slice(3);
    // 정상 12자리만 통과 (13/14자리 등 애매한 경우는 자르지 않고 오류로 안내 → 오절단 방지)
    if (digits.length !== 12) return { ok: false, reason: "length", value: digits };
    return { ok: true, value: digits };
  }

  // yyyy-MM-dd(또는 임의 구분자) → yyyyMMdd
  function fmtDateParam(d) {
    if (!d) return "";
    return String(d).replace(/[^0-9]/g, "").slice(0, 8);
  }

  function pick(obj, keys) {
    if (!obj) return null;
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      if (obj[k] != null && obj[k] !== "") return obj[k];
    }
    return null;
  }

  // 원본 배열 → 표준 레코드 배열 {date,kpn,rank,_raw}
  function normalizeRecords(list) {
    if (!Array.isArray(list)) return [];
    return list.map(function (r) {
      return {
        date: pick(r, FIELD_CANDIDATES.date),
        kpn:  pick(r, FIELD_CANDIDATES.kpn),
        rank: pick(r, FIELD_CANDIDATES.rank),
        _raw: r
      };
    }).filter(function (x) { return x.date != null || x.kpn != null; });
  }

  // 날짜 문자열(yyyyMMdd 또는 yyyy-MM-dd 등) → Date (정렬·간격계산용)
  function parseYmd(s) {
    if (!s) return null;
    var d = String(s).replace(/[^0-9]/g, "");
    if (d.length < 8) return null;
    var y = +d.slice(0, 4), m = +d.slice(4, 6), day = +d.slice(6, 8);
    var dt = new Date(y, m - 1, day);
    return isNaN(dt.getTime()) ? null : dt;
  }

  // 표준 레코드에 정렬·수정간격(일)을 계산해 부가정보로 붙임(두당 계산값, API 제공값 아님)
  function withIntervals(records) {
    var rows = records.slice().map(function (r) { return Object.assign({}, r, { _dt: parseYmd(r.date) }); });
    rows.sort(function (a, b) {
      if (a._dt && b._dt) return a._dt - b._dt;
      return String(a.date || "").localeCompare(String(b.date || ""));
    });
    var prev = null;
    rows.forEach(function (r) {
      if (r._dt && prev) r.gapDays = Math.round((r._dt - prev) / 86400000);
      else r.gapDays = null;
      if (r._dt) prev = r._dt;
    });
    return rows;
  }

  // ── 조회 (AWS 중계 호출) ──
  // params: {chiNo, insemDate?, kpnNo?, rowRank?}
  // 반환(표준): {ok, code, message?, chiNo, records:[{date,kpn,rank,gapDays,_raw}], raw}
  function getInseminationHistory(params) {
    params = params || {};
    var norm = normalizeChiNo(params.chiNo);
    if (!norm.ok) {
      var msg = norm.reason === "empty" ? "개체번호를 입력해 주세요." : "개체번호 형식을 확인해 주세요.";
      var code = norm.reason === "empty" ? "ERROR-340" : "ERROR-341";
      return Promise.resolve({ ok: false, code: code, message: msg });
    }
    if (!RELAY_URL) {
      return Promise.resolve({ ok: false, code: "NOT_CONFIGURED", message: "연동 준비 중", chiNo: norm.value });
    }

    var qs = new URLSearchParams();
    qs.set("chiNo", norm.value);
    if (params.insemDate) qs.set("insemDate", fmtDateParam(params.insemDate));
    if (params.kpnNo) qs.set("kpnNo", String(params.kpnNo).trim());
    if (params.rowRank) qs.set("rowRank", String(params.rowRank).trim());

    var ctrl = new AbortController();
    var timer = setTimeout(function () { ctrl.abort(); }, REQUEST_TIMEOUT_MS);

    return fetch(RELAY_URL + "?" + qs.toString(), { signal: ctrl.signal, headers: { "Accept": "application/json" } })
      .then(function (res) {
        clearTimeout(timer);
        return res.json().catch(function () { return null; }).then(function (data) {
          return { status: res.status, data: data };
        });
      })
      .then(function (r) {
        var data = r.data;
        if (!data) return { ok: false, code: "ERROR-500", message: "현재 한우AI 서버에서 자료를 조회할 수 없습니다. 잠시 후 다시 시도해 주세요." };
        // Lambda 표준형 { ok, code, message?, chiNo, records:[...], raw } 를 우선 사용.
        // records 가 없으면 items/list/data 등에서 배열을 찾아 관대하게 정규화.
        if (data.ok === false) return data;
        var arr = data.records || data.items || data.list ||
                  (Array.isArray(data.data) ? data.data : null) || [];
        var records = withIntervals(normalizeRecords(arr));
        return { ok: true, code: data.code || "INFO-000", chiNo: norm.value, records: records, raw: data.raw || data };
      })
      .catch(function (e) {
        clearTimeout(timer);
        if (e && e.name === "AbortError") return { ok: false, code: "TIMEOUT", message: "조회 시간이 초과되었습니다. 잠시 후 다시 시도해 주세요." };
        return { ok: false, code: navigator.onLine ? "NETWORK" : "OFFLINE", message: navigator.onLine ? "네트워크 오류로 조회할 수 없습니다." : "인터넷 연결이 없습니다." };
      });
  }

  global.HanwooAPI = {
    normalizeChiNo: normalizeChiNo,
    fmtDateParam: fmtDateParam,
    normalizeRecords: normalizeRecords,
    withIntervals: withIntervals,
    parseYmd: parseYmd,
    getInseminationHistory: getInseminationHistory,
    get relayUrl() { return RELAY_URL; },
    isConfigured: function () { return !!RELAY_URL; }
  };
})(window);
