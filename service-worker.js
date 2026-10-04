/* 두당 Service Worker · 저장: 2026-08-30 09:48 KST
   오프라인: 축종/용어/도우미/생산비 등 정적 콘텐츠 캐시.
   외부 API(카카오·람다·gtag)는 개입하지 않음 → 온라인에서만 동작(질병/소이력).
   콘텐츠 갱신 시 CACHE 버전을 올리세요. */
const CACHE = 'dudang-v53-2026.1004b';
const SHELL = [
  './', 'index.html', 'species.html', 'terms.html', 'helper.html', 'field.html', 'chukbi.html',
  'cattle.html', 'cattle_all.html', 'cattle_price.html', 'insemination.html', 'disease.html', 'livestock.html', 'survey.html', 'survey_breeding.html', 'survey_beef.html', 'manifest.json',
  'js/hanwooApi.js',
  'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png',
  'data/terms.json', 'data/helper.json', 'data/cattle_price/prices.json',
  'data/species/hanwoo-breeding.json', 'data/species/hanwoo-fattening.json', 'data/species/dairy.json',
  'data/species/beef-cattle.json', 'data/species/pig.json', 'data/species/layer.json', 'data/species/broiler.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => Promise.all(SHELL.map(u => c.add(u).catch(() => {}))))  // 일부 실패해도 설치 진행
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;   // 외부(카카오/람다/gtag)는 개입 안 함

  // HTML(페이지) + 데이터(JSON): 네트워크 우선 → 실패 시 캐시
  // ※ HTML을 네트워크 우선으로 하여 홈화면앱 메타 등 최신 페이지가 항상 반영되도록 함(옛 캐시본 추가 방지)
  const isHTML = req.mode === 'navigate' || url.pathname.endsWith('.html') || url.pathname === '/' || url.pathname.endsWith('/');
  if (url.pathname.endsWith('.json') || isHTML) {
    e.respondWith(
      fetch(req).then(r => { const cp = r.clone(); caches.open(CACHE).then(c => c.put(req, cp)); return r; })
        .catch(() => caches.match(req).then(h => h || (isHTML ? caches.match('index.html') : undefined)))
    );
    return;
  }

  // 그 외 정적(아이콘·js·css 등): 캐시 우선 + 백그라운드 갱신
  e.respondWith(
    caches.match(req).then(hit => {
      const net = fetch(req).then(r => { const cp = r.clone(); caches.open(CACHE).then(c => c.put(req, cp)); return r; })
        .catch(() => hit);
      return hit || net;
    })
  );
});
