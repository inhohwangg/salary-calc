export const SITE = {
  name: '급여계산 모음',
  domain: 'https://your-domain.com', // scripts/set-domain.mjs 로 한 번에 교체
  desc: '연봉 실수령액, 4대보험, 퇴직금, 주휴수당을 2026년 기준으로 계산합니다.',
  adsenseClient: '' // 승인 후 'ca-pub-0000000000000000' 형태로 채우면 광고가 켜집니다
};

const NAV = [
  ['/salary/', '연봉 실수령액'],
  ['/insurance/', '4대보험'],
  ['/severance/', '퇴직금'],
  ['/holiday-allowance/', '주휴수당'],
  ['/annual-leave/', '연차수당'],
  ['/wage-converter/', '시급·월급 환산']
];

function adBlock(slot) {
  if (!SITE.adsenseClient) return `<!-- 광고 자리 (${slot}): 애드센스 승인 후 layout.mjs의 adsenseClient를 채우면 자동 노출 -->`;
  return `<ins class="adsbygoogle" style="display:block" data-ad-client="${SITE.adsenseClient}" data-ad-slot="${slot}" data-ad-format="auto" data-full-width-responsive="true"></ins>
<script>(adsbygoogle = window.adsbygoogle || []).push({});</script>`;
}

export function layout(p) {
  const url = SITE.domain + p.path;
  const faqLd = p.faq && p.faq.length ? `<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: p.faq.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a.replace(/<[^>]+>/g, '') } }))
  })}</script>` : '';
  const related = (p.related || []).map(r => {
    const item = NAV.find(n => n[0] === r);
    return item ? `<li><a href="${item[0]}">${item[1]} 계산기</a></li>` : '';
  }).join('');
  return `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${p.title}</title>
<meta name="description" content="${p.desc}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="website">
<meta property="og:title" content="${p.title}">
<meta property="og:description" content="${p.desc}">
<meta property="og:url" content="${url}">
<meta property="og:site_name" content="${SITE.name}">
<link rel="stylesheet" href="/assets/style.css">
${SITE.adsenseClient ? `<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${SITE.adsenseClient}" crossorigin="anonymous"></script>` : ''}
${faqLd}
</head>
<body>
<header class="hd">
  <a class="logo" href="/">${SITE.name}</a>
  <nav><ul>${NAV.map(n => `<li><a href="${n[0]}"${p.path === n[0] ? ' aria-current="page"' : ''}>${n[1]}</a></li>`).join('')}</ul></nav>
</header>
<main>
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
</main>
<footer>
  <ul><li><a href="/about/">사이트 소개</a></li><li><a href="/contact/">문의</a></li><li><a href="/privacy/">개인정보처리방침</a></li><li><a href="/terms/">이용약관</a></li></ul>
  <p>&copy; ${new Date().getFullYear()} ${SITE.name}</p>
</footer>
<script src="/assets/rates.js"></script>
<script src="/assets/payroll.js"></script>
<script src="/assets/site.js"></script>
${p.script ? `<script>${p.script}</script>` : ''}
</body>
</html>`;
}
