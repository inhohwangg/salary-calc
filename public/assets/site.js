/* 테마 전환: 다크 대시보드 ↔ 신문판. 선택은 localStorage 에 남습니다.
   최초 적용은 layout.mjs 의 head 인라인 스크립트가 그리기 전에 처리합니다. */
var THEME_LABEL = { dark: '신문판', news: '대시보드판' };
function currentTheme() { return document.documentElement.getAttribute('data-theme') === 'news' ? 'news' : 'dark'; }
function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  document.getElementById('theme').href = '/assets/theme-' + t + '.css';
  var b = document.getElementById('themeBtn');
  if (b) b.textContent = THEME_LABEL[t];
}
function toggleTheme() {
  var t = currentTheme() === 'news' ? 'dark' : 'news';
  try { localStorage.setItem('theme', t); } catch (e) { /* 저장 불가여도 전환은 됩니다 */ }
  applyTheme(t);
}

/* 입력 편의 기능: 숫자 입력에 천단위 콤마, 입력 즉시 재계산 */
document.addEventListener('DOMContentLoaded', function () {
  var b = document.getElementById('themeBtn');
  if (b) b.textContent = THEME_LABEL[currentTheme()];
  document.querySelectorAll('input[data-comma]').forEach(function (el) {
    el.addEventListener('input', function () {
      var v = el.value.replace(/[^0-9]/g, '');
      el.value = v ? Number(v).toLocaleString('ko-KR') : '';
    });
  });
  document.querySelectorAll('form').forEach(function (f) {
    f.addEventListener('submit', function (e) { e.preventDefault(); });
    // 버튼 없이 입력만으로 결과가 바뀝니다. run() 은 각 페이지 스크립트가 정의합니다.
    f.addEventListener('input', function () { if (typeof run === 'function') run(); });
  });
});
function numOf(id) { var el = document.getElementById(id); return Number(String(el.value).replace(/[^0-9.]/g, '')) || 0; }
function setText(id, t) { document.getElementById(id).textContent = t; }
/* 입력 즉시 계산이라 alert 을 쓸 수 없습니다. 안내는 결과 자리에 인라인으로 띄웁니다. */
function setBig(id, t, bad) { var el = document.getElementById(id); el.textContent = t; el.classList.toggle('bad', !!bad); }
function pick(name) { var el = document.querySelector('input[name="' + name + '"]:checked'); return el ? el.value : ''; }
