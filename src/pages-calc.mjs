export const calcPages = [
{
  path: '/salary/',
  title: '연봉 실수령액 계산기 2026 | 세후 월급 바로 계산',
  desc: '2026년 4대보험 요율과 소득세를 반영해 연봉의 월 실수령액을 계산합니다. 비과세액과 부양가족 수까지 반영합니다.',
  h1: '연봉 실수령액 계산기 (2026년 기준)',
  intro: '연봉을 넣으면 4대보험과 소득세를 뺀 월 실수령액을 계산합니다. 2026년에 오른 국민연금 9.5%, 건강보험 7.19%를 반영했습니다.',
  body: `<form class="card">
  <div class="field"><label for="annual">연봉 (원)</label><input id="annual" type="text" inputmode="numeric" data-comma value="40,000,000"></div>
  <div class="row">
    <div class="field"><label for="nontax">월 비과세액 (식대 등)</label><input id="nontax" type="text" inputmode="numeric" data-comma value="200,000"></div>
    <div class="field"><label for="family">공제대상 가족수 (본인 포함)</label><input id="family" type="number" min="1" max="10" value="1"></div>
  </div>
  <button type="button" onclick="run()">계산하기</button>
</form>
<div class="result">
  <div>월 실수령액</div>
  <div class="big" id="net">-</div>
  <table><thead><tr><th>항목</th><th>월 금액</th></tr></thead><tbody id="rows"></tbody></table>
</div>`,
  steps: `<ol>
  <li>월 급여 = 연봉 ÷ 12</li>
  <li>과세 대상 = 월 급여 − 비과세액 (식대는 월 20만 원까지 비과세)</li>
  <li>국민연금 = 과세 대상 × 4.75% <span class="note-inline">(기준소득월액 상한 637만 원)</span></li>
  <li>건강보험 = 과세 대상 × 3.595%, 장기요양 = 건강보험료 × 13.14%</li>
  <li>고용보험 = 과세 대상 × 0.9%</li>
  <li>소득세 = (총급여 − 근로소득공제 − 인적공제 − 보험료공제)에 기본세율을 적용하고 근로소득세액공제를 뺀 값 ÷ 12</li>
  <li>지방소득세 = 소득세 × 10%</li>
</ol>
<p class="note">소득세는 연말정산 방식으로 계산한 추정치입니다. 회사가 매월 떼는 금액은 국세청 간이세액표를 쓰기 때문에 몇천 원 차이가 날 수 있고, 그 차이는 연말정산에서 정산됩니다.</p>`,
  article: `<h2>2026년에 실수령액이 줄어든 이유</h2>
<p>2026년부터 국민연금 요율이 9%에서 9.5%로 올랐습니다. 1998년 이후 28년 만의 인상이고, 근로자와 회사가 절반씩 부담하므로 근로자 부담은 4.5%에서 4.75%가 됐습니다. 건강보험도 7.09%에서 7.19%로, 장기요양보험은 건강보험료의 13.14%로 올랐습니다.</p>
<p>연봉 5,000만 원 직장인이라면 이 인상분만으로 월 1만 원 안팎이 더 빠져나갑니다. 고용보험은 2026년에는 1.8%(근로자 0.9%)로 동결이지만, 2027년 2.0% 인상안이 논의되고 있습니다.</p>
<h2>실수령액을 올리는 현실적인 방법</h2>
<p>세전 연봉이 같아도 비과세 항목을 쓰면 실수령액이 올라갑니다. 식대는 월 20만 원까지, 자가운전보조금은 월 20만 원까지, 출산·보육수당은 월 20만 원까지 비과세입니다. 이 항목들은 4대보험 부과 대상에서도 빠지기 때문에 보험료와 세금이 동시에 줄어듭니다. 연봉 협상 때 총액만 보지 말고 비과세 구성을 확인하세요.</p>`,
  faq: [
    { q: '실수령액이 회사에서 받은 명세서와 다릅니다.', a: '회사는 국세청 간이세액표로 원천징수하고, 이 계산기는 연말정산 방식으로 추정합니다. 두 방식은 원래 차이가 나며 차액은 다음 해 2월 연말정산에서 정산됩니다.' },
    { q: '비과세액은 무엇을 넣어야 하나요?', a: '급여명세서의 식대, 자가운전보조금, 보육수당 등 비과세 항목 합계를 넣으세요. 대부분 식대 월 20만 원입니다.' },
    { q: '공제대상 가족수는 어떻게 세나요?', a: '본인, 연소득 100만 원 이하인 배우자, 부양 요건을 충족하는 직계존비속을 합산합니다. 혼자면 1을 넣습니다.' },
    { q: '국민연금은 연봉이 높아도 계속 늘어나나요?', a: '아닙니다. 기준소득월액 상한이 637만 원이라 월 과세소득이 이를 넘으면 국민연금은 더 오르지 않습니다.' },
    { q: '연봉에 퇴직금이 포함된 경우는요?', a: '퇴직금 포함 연봉이면 실제 급여는 연봉의 12/13 수준입니다. 그 금액을 연봉 칸에 넣어야 실수령액이 맞습니다.' }
  ],
  related: ['/insurance/', '/severance/', '/wage-converter/'],
  script: `function run(){
  var annual=numOf('annual'), nontax=numOf('nontax'), family=numOf('family')||1;
  if(annual<=0){alert('연봉을 입력해 주세요.');return;}
  var r=Payroll.netPay(annual,{nonTaxMonthly:nontax,family:family});
  setText('net', Payroll.won(r.net)+'원');
  var rows=[['월 급여(세전)',r.monthlyGross],['국민연금',-r.insurance.pension],['건강보험',-r.insurance.health],['장기요양보험',-r.insurance.ltc],['고용보험',-r.insurance.employment],['소득세',-r.incomeTax],['지방소득세',-r.localTax],['공제 합계',-r.deduction],['월 실수령액',r.net]];
  document.getElementById('rows').innerHTML=rows.map(function(x){
    return '<tr><td>'+x[0]+'</td><td class="num">'+Payroll.won(x[1])+'원</td></tr>';}).join('');
}
document.addEventListener('DOMContentLoaded',run);`
},
{
  path: '/insurance/',
  title: '4대보험 계산기 2026 | 근로자·사업주 부담금',
  desc: '2026년 요율로 국민연금, 건강보험, 장기요양보험, 고용보험의 근로자 부담과 사업주 부담을 각각 계산합니다.',
  h1: '4대보험 계산기 (2026년 요율)',
  intro: '월 급여를 넣으면 근로자와 사업주가 각각 내는 보험료를 계산합니다.',
  body: `<form class="card">
  <div class="field"><label for="pay">월 급여 (과세 대상, 원)</label><input id="pay" type="text" inputmode="numeric" data-comma value="3,000,000"></div>
  <div class="field"><label for="size">사업장 규모 (고용안정·직업능력개발 부담분)</label>
    <select id="size">
      <option value="0.0025">150인 미만 (0.25%)</option>
      <option value="0.0045">150인 이상 우선지원 대상기업 (0.45%)</option>
      <option value="0.0065">150인 이상 1,000인 미만 (0.65%)</option>
      <option value="0.0085">1,000인 이상·국가지자체 (0.85%)</option>
    </select></div>
  <button type="button" onclick="run()">계산하기</button>
</form>
<div class="result">
  <div>근로자 부담 합계</div><div class="big" id="emp">-</div>
  <table><thead><tr><th>항목</th><th>근로자</th><th>사업주</th></tr></thead><tbody id="rows"></tbody></table>
</div>`,
  steps: `<ol>
  <li>국민연금 9.5%를 근로자와 사업주가 절반씩 부담합니다 (각 4.75%).</li>
  <li>건강보험 7.19%도 절반씩 부담합니다 (각 3.595%).</li>
  <li>장기요양보험은 건강보험료의 13.14%이며 역시 절반씩 부담합니다.</li>
  <li>고용보험 실업급여분 1.8%는 절반씩, 고용안정·직업능력개발 부담분은 사업주만 냅니다.</li>
  <li>산재보험은 전액 사업주 부담이며 업종별로 요율이 달라 이 계산기에는 포함하지 않았습니다.</li>
</ol>`,
  article: `<h2>2026년 달라진 요율</h2>
<p>국민연금은 9%에서 9.5%로, 건강보험은 7.09%에서 7.19%로 올랐습니다. 장기요양보험료율은 소득 대비 0.9448%로 건강보험료의 13.14% 수준입니다. 고용보험 실업급여분은 1.8%로 유지됐습니다.</p>
<h2>국민연금에는 상한과 하한이 있습니다</h2>
<p>기준소득월액 상한은 637만 원, 하한은 40만 원입니다. 월 소득이 상한을 넘어도 국민연금 보험료는 더 이상 늘지 않습니다. 이 기준은 매년 7월에 바뀝니다.</p>`,
  faq: [
    { q: '산재보험은 왜 빠져 있나요?', a: '산재보험료율은 업종별로 0.7%에서 18%대까지 크게 다르고 전액 사업주가 부담합니다. 업종 요율은 근로복지공단에서 확인할 수 있습니다.' },
    { q: '아르바이트도 4대보험에 가입하나요?', a: '월 60시간 이상 근무하면 원칙적으로 가입 대상입니다. 초단시간 근로자는 산재보험만 적용되는 경우가 많습니다.' },
    { q: '보험료는 어디서 떼나요?', a: '비과세 항목을 제외한 과세 대상 급여를 기준으로 부과합니다. 식대 등 비과세는 부과 대상에서 빠집니다.' },
    { q: '건강보험료 정산이란 무엇인가요?', a: '전년도 보수총액을 기준으로 4월에 정산합니다. 급여가 오른 해에는 4월에 추가 납부가 발생할 수 있습니다.' }
  ],
  related: ['/salary/', '/wage-converter/'],
  script: `function run(){
  var pay=numOf('pay'); var extra=Number(document.getElementById('size').value);
  var i=Payroll.insurance(pay);
  var empExtra=Payroll.floor10(pay*extra);
  var rows=[['국민연금',i.pension,i.pension],['건강보험',i.health,i.health],['장기요양보험',i.ltc,i.ltc],['고용보험(실업급여)',i.employment,i.employment],['고용안정·직업능력개발',0,empExtra],['합계',i.total,i.total+empExtra]];
  setText('emp',Payroll.won(i.total)+'원');
  document.getElementById('rows').innerHTML=rows.map(function(x){
    return '<tr><td>'+x[0]+'</td><td class="num">'+Payroll.won(x[1])+'원</td><td class="num">'+Payroll.won(x[2])+'원</td></tr>';}).join('');
}
document.addEventListener('DOMContentLoaded',run);`
}
];
