export const SITE = {
  name: '급여계산 모음',
  domain: 'https://your-domain.com', // scripts/set-domain.mjs 로 한 번에 교체
  desc: '연봉 실수령액, 4대보험, 퇴직금, 주휴수당을 2026년 기준으로 계산합니다.',
  adsenseClient: '', // 승인 후 'ca-pub-0000000000000000' 형태로 채우면 광고가 켜집니다
  rates: null // build.mjs 가 public/assets/rates.js 를 읽어 주입 (헤더 요율 배지용)
};

// [경로, 사이드바 라벨, 상단 화면 코드]
const NAV = [
  ['/', '홈', 'HOME'],
  ['/salary/', '연봉 실수령액', 'NET PAY · 실수령액'],
  ['/insurance/', '4대보험', 'INSURANCE · 4대보험'],
  ['/severance/', '퇴직금', 'SEVERANCE · 퇴직금'],
  ['/holiday-allowance/', '주휴수당', 'HOLIDAY PAY · 주휴수당'],
  ['/annual-leave/', '연차수당', 'ANNUAL LEAVE · 연차수당'],
  ['/wage-converter/', '시급·월급 환산', 'CONVERT · 환산'],
  ['/table/salary-2026/', '실수령액 표', 'TABLE · 실수령액 표']
];

function adBlock(slot) {
  if (!SITE.adsenseClient) return `<!-- 광고 자리 (${slot}): 애드센스 승인 후 layout.mjs의 adsenseClient를 채우면 자동 노출 -->`;
  return `<ins class="adsbygoogle" style="display:block" data-ad-client="${SITE.adsenseClient}" data-ad-slot="${slot}" data-ad-format="auto" data-full-width-responsive="true"></ins>
<script>(adsbygoogle = window.adsbygoogle || []).push({});</script>`;
}

function badges() {
  const R = SITE.rates;
  if (!R) return '';
  const pct = n => (n * 100).toFixed(2).replace(/\.?0+$/, '') + '%';
  const items = [
    ['최저임금', R.minWage.hourly.toLocaleString('ko-KR') + '원'],
    ['국민연금', pct(R.pension.total)],
    ['건강보험', pct(R.health.total)]
  ];
  return `<ul class="badges">${items.map(b => `<li><b>${b[0]}</b><span>${b[1]}</span></li>`).join('')}</ul>`;
}

export function layout(p) {
  const url = SITE.domain + p.path;
  const nav = NAV.find(n => n[0] === p.path);
  const faqLd = p.faq && p.faq.length ? `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: p.faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a.replace(/<[^>]+>/g, '') } }))
  })}</script>` : '';
  const related = (p.related || []).map(r => {
    const item = NAV.find(n => n[0] === r);
    return item ? `<li><a href="${item[0]}">${item[1]} 계산기</a></li>` : '';
  }).join('');
  return `<!DOCTYPE html>
<html lang="ko" data-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${p.title}</title>
<meta name="description" content="${p.desc}">
<link rel="canonical" href="${url}">
<meta id="themeColor" name="theme-color" content="#0A0F1E">
<meta property="og:type" content="website">
<meta property="og:title" content="${p.title}">
<meta property="og:description" content="${p.desc}">
<meta property="og:url" content="${url}">
<meta property="og:site_name" content="${SITE.name}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700&family=Noto+Serif+KR:wght@400;500;600&family=Roboto+Mono:wght@400;500;600&family=Source+Serif+4:wght@400;600&display=swap">
<link rel="manifest" href="/manifest.webmanifest">
<link rel="icon" href="/icon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/icon.svg">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="급여계산">
<link id="theme" rel="stylesheet" href="/assets/theme-dark.css">
<link rel="stylesheet" href="/assets/pwa.css">
<script>/* 저장된 테마를 그리기 전에 적용 — 깜빡임 방지 */
(function(){try{var t=localStorage.getItem('theme');if(t==='news'||t==='dark'){document.documentElement.setAttribute('data-theme',t);document.getElementById('theme').href='/assets/theme-'+t+'.css';document.getElementById('themeColor').content=t==='news'?'#f3f2f2':'#0A0F1E';}}catch(e){}})();</script>
${SITE.adsenseClient ? `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${SITE.adsenseClient}" crossorigin="anonymous"></script>` : ''}
${faqLd}
</head>
<body>
<div class="pwa-offline" role="status">오프라인 · 저장된 ${SITE.rates ? SITE.rates.year : ''} 요율로 계산 중</div>
<div class="shell">
<aside class="side">
  <a class="brand" href="/"><span class="mark">₩</span><span class="bt"><b>급여계산</b><i>PAYROLL ${SITE.rates ? SITE.rates.year : ''}</i></span></a>
  <nav aria-label="계산기"><ol>${NAV.map(n =>
    `<li><a href="${n[0]}"${p.path === n[0] ? ' aria-current="page"' : ''}>${n[1]}</a></li>`).join('')}</ol></nav>
  <div class="side-foot">
    <b>요율 기준 ${SITE.rates ? SITE.rates.updatedAt : ''}</b>
    <span>모든 계산은 브라우저에서 실행됩니다. 입력한 급여 정보는 서버로 전송되지 않습니다.</span>
  </div>
</aside>
<main class="main">
<header class="topbar">
  <div class="code">${nav ? nav[2] : (p.title.split('|')[0] || '').trim()}</div>
  ${badges()}
  <button type="button" id="themeBtn" class="theme-btn" onclick="toggleTheme()">신문판</button>
</header>
<div class="content">
<h1>${p.h1}</h1>
${p.intro ? `<p class="intro">${p.intro}</p>` : ''}
${adBlock('top')}
${p.body}
${p.steps ? `<section class="steps"><h2>계산 과정</h2>${p.steps}</section>` : ''}
${adBlock('mid')}
${p.article || ''}
${p.faq && p.faq.length ? `<section class="faq"><h2>자주 묻는 질문</h2>${p.faq.map(f => `<details><summary>${f.q}</summary><div>${f.a}</div></details>`).join('')}</section>` : ''}
${related ? `<section class="related"><h2>함께 보는 계산기</h2><ul>${related}</ul></section>` : ''}
<p class="disclaimer">이 계산기는 ${new Date().getFullYear()}년 기준 법정 요율로 계산한 참고용 결과입니다. 실제 급여는 회사 규정, 비과세 항목, 부양가족 요건에 따라 달라질 수 있습니다.</p>
<footer>
  <ul><li><a href="/about/">사이트 소개</a></li><li><a href="/contact/">문의</a></li><li><a href="/privacy/">개인정보처리방침</a></li><li><a href="/terms/">이용약관</a></li></ul>
  <p>&copy; ${new Date().getFullYear()} ${SITE.name}</p>
</footer>
</div>
</main>
</div>

<nav class="pwa-tabs" aria-label="계산기 탭">
  ${[['/salary/', '₩', '실수령액'], ['/insurance/', '4', '4대보험'],
     ['/wage-converter/', '시', '환산'], ['/table/salary-2026/', '표', '일람']]
    .map(t => `<a href="${t[0]}"${p.path === t[0] ? ' aria-current="page"' : ''}><span aria-hidden="true">${t[1]}</span><span>${t[2]}</span></a>`).join('')}
</nav>

<div class="pwa-install" role="dialog" aria-labelledby="pwaTitle">
  <div class="pwa-install-head">
    <div class="pwa-install-mark" aria-hidden="true">₩</div>
    <div class="pwa-install-text">
      <strong id="pwaTitle">홈 화면에 추가</strong>
      <span>주소창 없이 열리고 오프라인에서도 계산됩니다.</span>
    </div>
  </div>
  <div class="pwa-install-actions">
    <button type="button" id="pwaAdd">추가</button>
    <button type="button" id="pwaLater" class="ghost later">나중에</button>
  </div>
</div>

<script src="/assets/rates.js"></script>
<script src="/assets/payroll.js"></script>
<script src="/assets/site.js"></script>
<script src="/assets/pwa.js" defer></script>
${p.script ? `<script>${p.script}</script>` : ''}
</body>
</html>`;
}
