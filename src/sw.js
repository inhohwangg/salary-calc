/* 서비스워커 템플릿. build.mjs 가 아래 두 자리표를 채워
   public/sw.js 로 씁니다. 이 파일을 직접 배포하지 않습니다. */
const VERSION = '__VERSION__';
const CORE = __CORE__;
const PRE = 'pre-' + VERSION;
const FONT = 'font-v1';

// 설치할 때 전체 페이지와 자원을 미리 저장합니다.
self.addEventListener('install', e => {
  e.waitUntil(caches.open(PRE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

// 새 판이 올라오면 옛 캐시를 버립니다. 폰트 캐시는 판과 무관하므로 남깁니다.
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== PRE && k !== FONT).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // 구글 폰트: 캐시를 먼저 주고 뒤에서 갱신 (오프라인에서도 활자가 유지됩니다)
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith(caches.open(FONT).then(c => c.match(req).then(hit => {
      const net = fetch(req).then(res => {
        if (res.ok || res.type === 'opaque') c.put(req, res.clone());
        return res;
      }).catch(() => hit);
      return hit || net;
    })));
    return;
  }

  if (url.origin !== location.origin) return;

  // 문서는 네트워크 우선 — 요율이 바뀌면 바로 반영되어야 합니다.
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then(res => {
        const copy = res.clone();
        caches.open(PRE).then(c => c.put(req, copy));
        return res;
      }).catch(() => caches.match(req).then(hit => hit || caches.match('/')))
    );
    return;
  }

  // 나머지 같은 출처 자원은 캐시 우선
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => {
    if (res.ok) {
      const copy = res.clone();
      caches.open(PRE).then(c => c.put(req, copy));
    }
    return res;
  })));
});
