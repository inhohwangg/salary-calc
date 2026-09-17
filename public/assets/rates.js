/*
 * 2026년 급여 관련 요율 상수
 * 최종 확인일: 2026-09-18
 * 출처:
 *  - 국민연금 9.5% (2026년 인상), 근로자 1/2 부담
 *  - 건강보험 7.19% (2026년), 근로자 1/2 부담
 *  - 장기요양보험 소득 대비 0.9448% = 건강보험료의 13.14% (2026년)
 *  - 고용보험 실업급여분 1.8%, 근로자 0.9% (2026년 동결, 2027년 2.0% 인상 논의 중)
 *  - 산재보험: 전액 사업주 부담
 * !! 매년 1월과 7월에 아래 숫자를 반드시 갱신할 것 !!
 */
window.RATES = {
  year: 2026,
  updatedAt: '2026-09-18',
  pension: { total: 0.095, employee: 0.0475, capMonthly: 6370000, floorMonthly: 400000 },
  health: { total: 0.0719, employee: 0.03595 },
  ltc: { ofHealth: 0.1314 },
  employment: { employee: 0.009 },
  minWage: { hourly: 10320, monthly209: 2156880 },
  monthlyHours: 209,
  // 근로소득공제 (소득세법 제47조)
  earnedIncomeDeduction: [
    { upto: 5000000, base: 0, rate: 0.7, over: 0 },
    { upto: 15000000, base: 3500000, rate: 0.4, over: 5000000 },
    { upto: 45000000, base: 7500000, rate: 0.15, over: 15000000 },
    { upto: 100000000, base: 12000000, rate: 0.05, over: 45000000 },
    { upto: Infinity, base: 14750000, rate: 0.02, over: 100000000 }
  ],
  earnedIncomeDeductionCap: 20000000,
  // 기본세율 (소득세법 제55조) [과세표준 상한, 세율, 누진공제]
  taxBrackets: [
    [14000000, 0.06, 0],
    [50000000, 0.15, 1260000],
    [88000000, 0.24, 5760000],
    [150000000, 0.35, 15440000],
    [300000000, 0.38, 19940000],
    [500000000, 0.40, 25940000],
    [1000000000, 0.42, 35940000],
    [Infinity, 0.45, 65940000]
  ],
  personalDeductionPerHead: 1500000,
  localTaxRate: 0.1
};
