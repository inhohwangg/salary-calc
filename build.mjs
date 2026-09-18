import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { layout, SITE } from './src/layout.mjs';
import { calcPages } from './src/pages-calc.mjs';
import { calcPages2 } from './src/pages-calc2.mjs';
import { calcPages3 } from './src/pages-calc3.mjs';
import { miscPages } from './src/pages-misc.mjs';

const OUT = 'public';
const g = {};
globalThis.window = g;
eval(fs.readFileSync('public/assets/rates.js', 'utf8').replace(/window\./g, 'g.'));
eval(fs.readFileSync('public/assets/payroll.js', 'utf8'));
const P = g.Payroll;
SITE.rates = g.RATES; // 헤더 요율 배지 / 사이드바 기준일

let rows = '';
for (let salary = 24000000; salary <= 120000000; salary += 1000000) {
  const r = P.netPay(salary, { nonTaxMonthly: 200000, family: 1 });
  const rate = (r.deduction / Math.max(r.monthlyGross, 1) * 100).toFixed(1);
  rows += `<tr><td>${(salary / 10000).toLocaleString('ko-KR')}만원</td>`
    + `<td class="num">${P.won(r.net)}</td>`
    + `<td class="num">${P.won(r.deduction)}</td>`
    + `<td class="rate"><span class="tbar"><i style="width:${rate}%"></i></span><b>${rate}%</b></td></tr>`;
}

const pages = [...miscPages(rows, g.RATES), ...calcPages, ...calcPages2, ...calcPages3];

for (const p of pages) {
  const dir = path.join(OUT, p.path);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), layout(p));
}

fs.writeFileSync(path.join(OUT, '404.html'), layout({
  path: '/404', title: '페이지를 찾을 수 없습니다 | ' + SITE.name,
  desc: '요청하신 페이지가 없습니다.', h1: '페이지를 찾을 수 없습니다',
  body: '<p>주소가 바뀌었거나 삭제된 페이지입니다. <a href="/">계산기 목록</a>에서 원하는 계산기를 찾아보세요.</p>'
}));

const today = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(OUT, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`
  + pages.map(p => `  <url><loc>${SITE.domain}${p.path}</loc><lastmod>${today}</lastmod></url>`).join('\n')
  + `\n</urlset>\n`);

fs.writeFileSync(path.join(OUT, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${SITE.domain}/sitemap.xml\n`);

fs.writeFileSync(path.join(OUT, '_headers'),
  `/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n\n/assets/*\n  Cache-Control: public, max-age=86400\n\n/sw.js\n  Cache-Control: no-cache\n\n/manifest.webmanifest\n  Cache-Control: public, max-age=3600\n`);

// --- 서비스워커: 미리 저장할 목록과 판 번호를 빌드 시점에 박아 넣습니다 ---
const ASSETS = [
  '/assets/theme-dark.css', '/assets/theme-news.css', '/assets/pwa.css',
  '/assets/rates.js', '/assets/payroll.js', '/assets/site.js', '/assets/pwa.js',
  '/manifest.webmanifest', '/icon.svg', '/icon-maskable.svg'
];
const core = [...pages.map(p => p.path), '/404.html', ...ASSETS];
// 판 번호는 내용 해시입니다. 내용이 그대로면 재빌드해도 sw.js 가 바뀌지 않습니다.
const version = crypto.createHash('sha256')
  .update(core.join('|'))
  .update(ASSETS.map(a => fs.readFileSync(path.join(OUT, a.slice(1)), 'utf8')).join(''))
  .update(pages.map(p => layout(p)).join(''))
  .digest('hex').slice(0, 12);
fs.writeFileSync(path.join(OUT, 'sw.js'), fs.readFileSync('src/sw.js', 'utf8')
  .replace(/__VERSION__/g, version)
  .replace(/__CORE__/g, JSON.stringify(core)));

console.log(`생성 완료: ${pages.length + 1}개 페이지, sitemap ${pages.length}개 URL, sw ${version} (${core.length}개 미리 저장)`);
