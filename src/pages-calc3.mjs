export const calcPages3 = [
{
  path: '/annual-leave/',
  title: '연차수당 계산기 2026 | 미사용 연차 수당 계산',
  desc: '통상임금을 기준으로 미사용 연차수당을 계산합니다. 입사 연차에 따른 연차 발생 일수도 함께 확인할 수 있습니다.',
  h1: '연차수당 계산기',
  intro: '쓰지 못한 연차는 수당으로 받습니다. 통상임금 기준으로 계산합니다.',
  body: `<form class="card">
  <div class="field field--lead"><label for="monthly">월 통상임금 (원)</label><input id="monthly" type="text" inputmode="numeric" data-comma value="3,000,000"></div>
  <div class="row">
    <div class="field"><label for="daily">1일 소정근로시간</label><input id="daily" type="number" step="0.5" min="1" max="12" value="8"></div>
    <div class="field"><label for="unused">미사용 연차 일수</label><input id="unused" type="number" min="0" max="30" value="5"></div>
    <div class="field"><label for="years">근속 연수</label><input id="years" type="number" min="0" max="40" value="3"></div>
  </div>
  <p class="note">통상시급 = 월 통상임금 ÷ 209시간. 미사용 연차수당 청구권은 발생일로부터 3년입니다.</p>
</form>
<div class="result">
  <div>미사용 연차수당</div><div class="big" id="amt">-</div>
  <table><tbody id="rows"></tbody></table>
</div>`,
  steps: `<ol>
  <li>통상시급 = 월 통상임금 ÷ 209시간</li>
  <li>1일 연차수당 = 통상시급 × 1일 소정근로시간</li>
  <li>연차수당 = 1일 연차수당 × 미사용 일수</li>
</ol>
<p class="note">통상임금에는 기본급과 정기적·일률적으로 지급되는 고정수당이 들어갑니다. 성과급처럼 변동되는 금액은 제외합니다.</p>`,
  article: `<h2>연차는 몇 개 생기나요</h2>
<p>1년 미만 근무자는 1개월 개근마다 1일씩, 최대 11일이 생깁니다. 1년 이상이면 15일이고, 3년째부터 2년마다 1일씩 늘어 최대 25일까지 발생합니다. 예를 들어 근속 5년이면 16일, 7년이면 17일입니다.</p>
<h2>연차수당 청구권은 3년입니다</h2>
<p>미사용 연차수당은 발생일로부터 3년 안에 청구할 수 있습니다. 다만 회사가 서면으로 연차 사용을 촉진했고 절차를 지켰다면 수당 지급 의무가 없어질 수 있습니다. 이를 연차사용촉진제도라고 합니다.</p>`,
  faq: [
    { q: '통상임금과 평균임금은 어떻게 다른가요?', a: '통상임금은 정기적·일률적으로 지급되는 고정 임금이고, 평균임금은 최근 3개월 실제 지급액 기준입니다. 연차수당은 통상임금, 퇴직금은 평균임금을 씁니다.' },
    { q: '209시간은 어디서 나온 숫자인가요?', a: '주 40시간 근로에 주휴 8시간을 더한 48시간에 연간 주수를 곱해 월평균으로 환산한 값입니다.' },
    { q: '퇴사할 때 남은 연차는요?', a: '퇴사 시점까지 발생한 연차 중 사용하지 않은 일수는 모두 수당으로 지급받아야 합니다.' },
    { q: '5인 미만 사업장도 연차가 있나요?', a: '아닙니다. 연차유급휴가는 상시 5인 이상 사업장에 적용됩니다.' }
  ],
  related: ['/severance/', '/salary/'],
  script: `function run(){
  var m=numOf('monthly'), d=numOf('daily'), u=numOf('unused'), y=numOf('years');
  var hourly=m/209, perDay=hourly*d, amt=perDay*u;
  var days = y<1?'최대 11일 (1개월 개근당 1일)' : Math.min(15+Math.floor(Math.max(y-1,0)/2),25)+'일';
  setText('amt',Payroll.won(amt)+'원');
  var rows=[['통상시급',Payroll.won(hourly)+'원'],['1일 연차수당',Payroll.won(perDay)+'원'],['근속 '+y+'년 연차 발생',days]];
  document.getElementById('rows').innerHTML=rows.map(function(x){return '<tr><td>'+x[0]+'</td><td class="num">'+x[1]+'</td></tr>';}).join('');
}
document.addEventListener('DOMContentLoaded',run);`
},
{
  path: '/wage-converter/',
  title: '시급 월급 환산 계산기 | 연봉까지 한 번에',
  desc: '시급, 일급, 주급, 월급, 연봉을 서로 환산합니다. 주휴수당 포함 여부를 선택할 수 있습니다.',
  h1: '시급·월급 환산 계산기',
  intro: '하나만 입력하면 나머지를 모두 환산합니다. 월급은 주 40시간 기준 209시간으로 계산합니다.',
  body: `<form class="card">
  <div class="field">
    <label id="unitLabel">입력 단위</label>
    <ul class="seg" role="radiogroup" aria-labelledby="unitLabel">
      <li><label><input type="radio" name="unit" value="hour" checked>시급</label></li>
      <li><label><input type="radio" name="unit" value="day">일급</label></li>
      <li><label><input type="radio" name="unit" value="week">주급</label></li>
      <li><label><input type="radio" name="unit" value="month">월급</label></li>
      <li><label><input type="radio" name="unit" value="year">연봉</label></li>
    </ul>
  </div>
  <div class="field field--lead"><label for="amount">금액 (원)</label><input id="amount" type="text" inputmode="numeric" data-comma value="10,320"></div>
  <p class="note">209시간 = (주 40시간 + 주휴 8시간) × 365 ÷ 7 ÷ 12. 최저임금 위반 여부도 이 기준으로 판단합니다.</p>
</form>
<div class="result">
  <table><tbody id="rows"></tbody></table>
</div>`,
  steps: `<ol>
  <li>월 소정근로시간 209시간 = (주 40시간 + 주휴 8시간) × 365일 ÷ 7일 ÷ 12개월</li>
  <li>시급 = 월급 ÷ 209</li>
  <li>연봉 = 월급 × 12</li>
</ol>`,
  article: `<h2>209시간의 의미</h2>
<p>주 40시간을 일하면 주휴 8시간이 더해져 주 48시간분의 임금을 받습니다. 이를 월평균으로 환산하면 약 209시간이 됩니다. 그래서 월급제 근로자의 시급을 구할 때는 월급을 209로 나눕니다. 최저임금 위반 여부도 이 기준으로 판단합니다.</p>
<h2>2026년 최저임금 기준 금액</h2>
<p>시급 10,320원, 주 40시간 기준 월 환산액은 2,156,880원, 연봉으로는 25,882,560원입니다. 수습 기간이라도 1년 이상 근로계약을 맺고 단순노무직이 아닌 경우에만 3개월간 10% 감액이 가능합니다.</p>`,
  faq: [
    { q: '주 20시간 근무면 월 소정근로시간은 몇 시간인가요?', a: '주 20시간이면 주휴 4시간이 더해져 주 24시간, 월 약 104.5시간입니다.' },
    { q: '연봉에 퇴직금이 포함된 경우는?', a: '퇴직금 포함 연봉은 13으로 나눠야 실제 월 급여가 됩니다. 고용노동부는 퇴직금 분할 지급을 원칙적으로 무효로 봅니다.' },
    { q: '주 5일 8시간 근무면 월급은 얼마인가요?', a: '2026년 최저임금 기준 2,156,880원입니다. 여기서 4대보험과 세금이 공제됩니다.' }
  ],
  related: ['/holiday-allowance/', '/salary/'],
  script: `function run(){
  var v=numOf('amount'), u=pick('unit'), H=209;
  var hour;
  if(u==='hour')hour=v; else if(u==='day')hour=v/8; else if(u==='week')hour=v/40; else if(u==='month')hour=v/H; else hour=v/12/H;
  var month=hour*H;
  var rows=[['시급',hour,'hour'],['일급 (8시간)',hour*8,'day'],['주급 (40시간 + 주휴)',hour*48,'week'],['월급 (209시간)',month,'month'],['연봉',month*12,'year']];
  document.getElementById('rows').innerHTML=rows.map(function(x){
    return '<tr'+(x[2]===u?' class="on"':'')+'><td>'+x[0]+'</td><td class="num">'+Payroll.won(x[1])+'원</td></tr>';}).join('');
}
document.addEventListener('DOMContentLoaded',run);`
}
];
