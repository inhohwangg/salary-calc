/* PWA: 서비스워커 등록, 오프라인 띠, 설치 권유 띠.
   계산은 원래 전부 브라우저에서 돌기 때문에 오프라인에서도 기능 제한이 없습니다. */
(function () {
  var DISMISS_KEY = 'pwaDismissedAt';
  var USED_KEY = 'pwaUsedCalc';
  var DISMISS_DAYS = 30;
  var deferred = null;

  function store(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* 사생활 보호 모드 */ } }
  function read(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }

  /* --- 서비스워커 --- */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/sw.js').catch(function () { /* 등록 실패해도 사이트는 그대로 동작 */ });
    });
  }

  /* --- 오프라인 띠 --- */
  function syncOnline() {
    document.documentElement.classList.toggle('is-offline', !navigator.onLine);
  }
  window.addEventListener('online', syncOnline);
  window.addEventListener('offline', syncOnline);
  syncOnline();

  /* --- 설치 권유 --- */
  // 한 번 계산을 끝낸 사용자에게만, 닫으면 30일간 다시 묻지 않습니다.
  function dismissedRecently() {
    var at = Number(read(DISMISS_KEY) || 0);
    return at > 0 && Date.now() - at < DISMISS_DAYS * 86400000;
  }
  function maybeShow() {
    if (!deferred || !read(USED_KEY) || dismissedRecently()) return;
    document.documentElement.classList.add('can-install');
  }
  window.addEventListener('beforeinstallprompt', function (e) {
    e.preventDefault();     // 브라우저 기본 배너 대신 우리 띠를 씁니다
    deferred = e;
    maybeShow();
  });
  window.addEventListener('appinstalled', function () {
    document.documentElement.classList.remove('can-install');
    store(DISMISS_KEY, String(Date.now()));
  });

  document.addEventListener('DOMContentLoaded', function () {
    // 계산기 페이지에서 값을 실제로 바꾼 시점을 "한 번 써봤다"로 봅니다
    var form = document.querySelector('form.card');
    if (form) form.addEventListener('input', function onFirst() {
      store(USED_KEY, '1');
      form.removeEventListener('input', onFirst);
      maybeShow();
    });
    maybeShow();

    var add = document.getElementById('pwaAdd');
    var later = document.getElementById('pwaLater');
    if (add) add.addEventListener('click', function () {
      document.documentElement.classList.remove('can-install');
      if (!deferred) return;
      deferred.prompt();
      deferred.userChoice.then(function () { deferred = null; });
    });
    if (later) later.addEventListener('click', function () {
      store(DISMISS_KEY, String(Date.now()));
      document.documentElement.classList.remove('can-install');
    });
  });
})();
