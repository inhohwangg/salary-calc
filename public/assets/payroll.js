/* 급여 계산 공통 로직. window.RATES(rates.js)가 먼저 로드되어야 합니다. */
(function (global) {
  var R = global.RATES;
  var won = function (n) { return Math.round(n).toLocaleString('ko-KR'); };
  var floor10 = function (n) { return Math.floor(n / 10) * 10; };

  function pensionEmployee(monthly) {
    var base = Math.min(Math.max(monthly, R.pension.floorMonthly), R.pension.capMonthly);
    return floor10(base * R.pension.employee);
  }
  function healthEmployee(monthly) { return floor10(monthly * R.health.employee); }
  function ltcEmployee(healthPremium) { return floor10(healthPremium * R.ltc.ofHealth); }
  function employmentEmployee(monthly) { return floor10(monthly * R.employment.employee); }

  function insurance(monthlyTaxable) {
    var p = pensionEmployee(monthlyTaxable);
    var h = healthEmployee(monthlyTaxable);
    var l = ltcEmployee(h);
    var e = employmentEmployee(monthlyTaxable);
    return { pension: p, health: h, ltc: l, employment: e, total: p + h + l + e };
  }

  function earnedIncomeDeduction(gross) {
    var t = R.earnedIncomeDeduction.find(function (b) { return gross <= b.upto; });
    return Math.min(t.base + (gross - t.over) * t.rate, R.earnedIncomeDeductionCap);
  }

  function calcTax(taxBase) {
    if (taxBase <= 0) return 0;
    var b = R.taxBrackets.find(function (x) { return taxBase <= x[0]; });
    return Math.max(taxBase * b[1] - b[2], 0);
  }

  // 근로소득세액공제 (소득세법 제59조)
  function earnedIncomeTaxCredit(computedTax, gross) {
    var credit = computedTax <= 1300000
      ? computedTax * 0.55
      : 715000 + (computedTax - 1300000) * 0.3;
    var cap;
    if (gross <= 33000000) cap = 740000;
    else if (gross <= 70000000) cap = Math.max(740000 - (gross - 33000000) * 0.008, 660000);
    else if (gross <= 120000000) cap = Math.max(660000 - (gross - 70000000) * 0.5, 500000);
    else cap = Math.max(500000 - (gross - 120000000) * 0.5, 200000);
    return Math.min(credit, cap);
  }

  /* 연 총급여(비과세 제외) 기준 소득세 추정 — 연말정산 방식 근사치 */
  function annualIncomeTax(grossAnnual, insuranceAnnual, family) {
    var incomeAmount = grossAnnual - earnedIncomeDeduction(grossAnnual);
    var personal = R.personalDeductionPerHead * Math.max(family, 1);
    var taxBase = incomeAmount - personal - insuranceAnnual;
    var computed = calcTax(Math.max(taxBase, 0));
    var tax = Math.max(computed - earnedIncomeTaxCredit(computed, grossAnnual), 0);
    return { taxBase: Math.max(taxBase, 0), computed: computed, incomeTax: tax, localTax: tax * R.localTaxRate };
  }

  /* 연봉 -> 월 실수령액 */
  function netPay(annualSalary, opts) {
    opts = opts || {};
    var nonTaxMonthly = opts.nonTaxMonthly || 0;   // 비과세액(식대 등)
    var family = opts.family || 1;                 // 본인 포함 공제대상 가족수
    var monthlyGross = annualSalary / 12;
    var monthlyTaxable = Math.max(monthlyGross - nonTaxMonthly, 0);
    var ins = insurance(monthlyTaxable);
    var grossAnnualTaxable = monthlyTaxable * 12;
    var t = annualIncomeTax(grossAnnualTaxable, ins.total * 12, family);
    var incomeTaxM = floor10(t.incomeTax / 12);
    var localTaxM = floor10(t.localTax / 12);
    var deduction = ins.total + incomeTaxM + localTaxM;
    return {
      monthlyGross: Math.round(monthlyGross),
      monthlyTaxable: Math.round(monthlyTaxable),
      insurance: ins,
      incomeTax: incomeTaxM,
      localTax: localTaxM,
      taxBase: t.taxBase,
      deduction: deduction,
      net: Math.round(monthlyGross - deduction)
    };
  }

  global.Payroll = {
    won: won, floor10: floor10, insurance: insurance, netPay: netPay,
    annualIncomeTax: annualIncomeTax, earnedIncomeDeduction: earnedIncomeDeduction,
    calcTax: calcTax, earnedIncomeTaxCredit: earnedIncomeTaxCredit
  };
})(typeof window !== 'undefined' ? window : globalThis);
