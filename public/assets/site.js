/* 입력 편의 기능: 숫자 입력에 천단위 콤마, 엔터로 계산 */
document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('input[data-comma]').forEach(function (el) {
    el.addEventListener('input', function () {
      var v = el.value.replace(/[^0-9]/g, '');
      el.value = v ? Number(v).toLocaleString('ko-KR') : '';
    });
  });
  document.querySelectorAll('form').forEach(function (f) {
    f.addEventListener('submit', function (e) { e.preventDefault(); });
  });
});
function numOf(id) { var el = document.getElementById(id); return Number(String(el.value).replace(/[^0-9.]/g, '')) || 0; }
function setText(id, t) { document.getElementById(id).textContent = t; }
