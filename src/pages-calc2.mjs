export const calcPages2 = [
{
  path: '/severance/',
  title: '퇴직금 계산기 2026 | 평균임금 기준 자동 계산',
  desc: '입사일과 퇴사일, 최근 3개월 급여를 넣으면 평균임금과 퇴직금을 계산합니다. 연간 상여금과 연차수당도 반영합니다.',
  h1: '퇴직금 계산기',
  intro: '1년 이상 일했다면 퇴직금을 받습니다. 퇴직 전 3개월 급여를 기준으로 한 평균임금으로 계산합니다.',
  body: `<form class="card">
  <div class="row">
    <div class="field"><label for="join">입사일</label><input id="join" type="date" value="2022-03-02"></div>
    <div class="field"><label for="leave">퇴사일 (마지막 근무일 다음 날)</label><input id="leave" type="date" value="2026-03-02"></div>
  </div>
  <div class="field"><label for="m3">퇴직 전 3개월 임금 총액 (원)</label><input id="m3" type="text" inputmode="numeric" data-comma value="9,000,000"></div>
  <div class="row">
    <div class="field"><label for="bonus">연간 상여금 (원)</label><input id="bonus" type="text" inputmode="numeric" data-comma value="0"></div>
    <div class="field"><label for="leavepay">연차수당 (직전 1년, 원)</label><input id="leavepay" type="text" inputmode="numeric" data-comma value="0"></div>
  </div>
  <button type="button" onclick="run()">계산하기</button>
</form>
<div class="result">
  <div>예상 퇴직금 (세전)</div><div class="big" id="pay">-</div>
  <table><tbody id="rows"></tbody></table>
</div>`,
  steps: `<ol>
  <li>재직일수 = 퇴사일 − 입사일</li>
  <li>평균임금 산정 기준액 = 퇴직 전 3개월 임금 + 연간 상여금 × 3/12 + 연차수당 × 3/12</li>
  <li>1일 평균임금 = 기준액 ÷ 퇴직 전 3개월의 총 일수</li>
  <li>퇴직금 = 1일 평균임금 × 30일 × (재직일수 ÷ 365)</li>
</ol>
<p class="note">평균임금이 통상임금보다 적으면 통상임금으로 계산합니다. 또한 1년 미만 근무자는 퇴직금 지급 대상이 아닙니다.</p>`,
  article: `<h2>퇴직금은 언제 받을 수 있나요</h2>
<p>주 15시간 이상, 1년 이상 계속 근무했다면 퇴직금 지급 대상입니다. 회사는 퇴직일로부터 14일 이내에 지급해야 하며, 당사자 합의가 있으면 기일을 연장할 수 있습니다. 지급하지 않으면 지연이자와 함께 노동청에 진정할 수 있습니다.</p>
<h2>퇴직금과 퇴직연금(DB·DC)의 차이</h2>
<p>퇴직연금 DB형은 퇴직금과 계산 방식이 같습니다. DC형은 회사가 매년 연간 임금총액의 1/12 이상을 근로자 계좌에 넣고 운용 손익이 더해지므로, 이 계산기의 결과와 다를 수 있습니다. 본인 가입 유형은 급여명세서나 인사팀에서 확인하세요.</p>
<h2>세금은 얼마나 떼나요</h2>
<p>퇴직소득세는 근속연수공제와 환산급여공제를 거쳐 계산되기 때문에 일반 소득세보다 부담이 훨씬 낮습니다. 근속연수가 길수록 실효세율이 떨어집니다. 이 계산기는 세전 금액을 보여줍니다.</p>`,
  faq: [
    { q: '퇴사일은 마지막 근무일인가요?', a: '퇴직금 계산에서 재직일수는 마지막 근무일까지 포함합니다. 이 계산기의 퇴사일 칸에는 마지막 근무일의 다음 날을 넣으면 재직일수가 정확히 계산됩니다.' },
    { q: '3개월 임금 총액에 무엇을 넣나요?', a: '기본급뿐 아니라 고정수당, 식대 등 정기적으로 지급된 임금을 모두 포함합니다. 비정기적 상여는 연간 상여금 칸에 따로 넣습니다.' },
    { q: '육아휴직 기간도 포함되나요?', a: '재직일수에는 포함되지만 평균임금 산정 기간에서는 제외합니다. 휴직 직전 3개월로 계산해야 불이익이 없습니다.' },
    { q: '퇴직금을 미리 받았습니다.', a: '중간정산을 받았다면 정산 이후 기간만 재직일수로 계산합니다. 입사일 칸에 중간정산 기준일을 넣으세요.' }
  ],
  related: ['/salary/', '/annual-leave/'],
  script: `function run(){
  var j=new Date(document.getElementById('join').value), l=new Date(document.getElementById('leave').value);
  if(isNaN(j)||isNaN(l)||l<=j){alert('입사일과 퇴사일을 확인해 주세요.');return;}
  var days=Math.round((l-j)/86400000);
  var d3=Math.round((l-new Date(l.getFullYear(),l.getMonth()-3,l.getDate()))/86400000);
  var base=numOf('m3')+numOf('bonus')*3/12+numOf('leavepay')*3/12;
  var avg=base/d3, pay=avg*30*(days/365);
  setText('pay', days<365? '1년 미만 (지급 대상 아님)' : Payroll.won(pay)+'원');
  var rows=[['재직일수',days+'일'],['평균임금 산정 기간',d3+'일'],['1일 평균임금',Payroll.won(avg)+'원'],['30일분 임금',Payroll.won(avg*30)+'원'],['근속 연수 환산',(days/365).toFixed(2)+'년']];
  document.getElementById('rows').innerHTML=rows.map(function(x){return '<tr><td>'+x[0]+'</td><td class="num">'+x[1]+'</td></tr>';}).join('');
}
document.addEventListener('DOMContentLoaded',run);`
},
{
  path: '/holiday-allowance/',
  title: '주휴수당 계산기 2026 | 주 15시간 알바 주휴수당',
  desc: '2026년 최저임금 10,320원 기준으로 주휴수당을 계산합니다. 주 소정근로시간만 넣으면 주급과 월 환산액까지 나옵니다.',
  h1: '주휴수당 계산기',
  intro: '주 15시간 이상 일하고 약속한 날에 모두 출근하면 하루치 임금을 더 받습니다. 그게 주휴수당입니다.',
  body: `<form class="card">
  <div class="row">
    <div class="field"><label for="wage">시급 (원)</label><input id="wage" type="text" inputmode="numeric" data-comma value="10,320"></div>
    <div class="field"><label for="hours">주 소정근로시간</label><input id="hours" type="number" step="0.5" min="0" max="60" value="20"></div>
  </div>
  <button type="button" onclick="run()">계산하기</button>
</form>
<div class="result">
  <div>주휴수당 (1주)</div><div class="big" id="weekly">-</div>
  <table><tbody id="rows"></tbody></table>
</div>`,
  steps: `<ol>
  <li>주 15시간 미만이면 주휴수당이 발생하지 않습니다.</li>
  <li>주휴시간 = 주 소정근로시간 ÷ 40 × 8 (최대 8시간)</li>
  <li>주휴수당 = 주휴시간 × 시급</li>
  <li>월 환산은 1개월을 4.345주로 계산합니다.</li>
</ol>`,
  article: `<h2>2026년 최저임금은 시급 10,320원입니다</h2>
<p>주 40시간을 일하면 주휴수당을 포함한 월 환산액은 2,156,880원입니다. 209시간 기준이며, 이 금액보다 적게 받으면 최저임금 위반입니다.</p>
<h2>주휴수당을 못 받는 경우</h2>
<p>주 소정근로시간이 15시간 미만이거나, 약속한 근무일에 결근한 주에는 주휴수당이 발생하지 않습니다. 지각이나 조퇴는 결근이 아니므로 주휴수당에 영향을 주지 않습니다. 사업장 규모와 무관하게 5인 미만 사업장에도 주휴수당은 적용됩니다.</p>
<h2>시급에 주휴수당이 포함되어 있다는 말</h2>
<p>이른바 포괄 시급입니다. 이 경우 시급이 최저임금 이상인지 따질 때 주휴수당을 뺀 금액으로 계산해야 합니다. 예를 들어 주휴 포함 12,000원이라면 실제 시급은 약 10,000원이어서 최저임금에 못 미칩니다.</p>`,
  faq: [
    { q: '주 15시간을 겨우 넘기면 얼마나 받나요?', a: '주 15시간이면 주휴시간은 3시간이고, 2026년 최저임금 기준 30,960원입니다.' },
    { q: '월급제도 주휴수당을 따로 받나요?', a: '월급제는 이미 주휴수당이 포함된 209시간 기준으로 책정되는 것이 일반적입니다. 급여명세서의 소정근로시간을 확인하세요.' },
    { q: '5인 미만 사업장도 해당되나요?', a: '네. 주휴수당은 사업장 규모와 관계없이 적용됩니다.' },
    { q: '주휴수당을 안 주면 어떻게 하나요?', a: '임금 체불에 해당합니다. 고용노동부 홈페이지나 관할 노동청에 진정을 넣을 수 있고, 3년 이내 청구가 가능합니다.' }
  ],
  related: ['/wage-converter/', '/annual-leave/'],
  script: `function run(){
  var w=numOf('wage'), h=numOf('hours');
  var wh = h<15?0:Math.min(h/40*8,8);
  var amt=wh*w;
  setText('weekly', h<15? '없음 (주 15시간 미만)' : Payroll.won(amt)+'원');
  var rows=[['주휴시간',wh.toFixed(1)+'시간'],['주급(근로분)',Payroll.won(h*w)+'원'],['주급(주휴 포함)',Payroll.won(h*w+amt)+'원'],['월 환산(4.345주)',Payroll.won((h*w+amt)*4.345)+'원']];
  document.getElementById('rows').innerHTML=rows.map(function(x){return '<tr><td>'+x[0]+'</td><td class="num">'+x[1]+'</td></tr>';}).join('');
}
document.addEventListener('DOMContentLoaded',run);`
}
];
