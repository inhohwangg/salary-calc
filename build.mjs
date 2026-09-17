import fs from 'node:fs';
import path from 'node:path';
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

let rows = '';
for (let salary = 24000000; salary <= 120000000; salary += 1000000) {
  const r = P.netPay(salary, { nonTaxMonthly: 200000, family: 1 });
  rows += `<tr><td>${(salary / 10000).toLocaleString('ko-KR')}만원</td>`
    + `<td class="num">${P.won(r.monthlyGross)}</td>`
    + `<td class="num">${P.won(r.insurance.total)}</td>`
    + `<td class="num">${P.won(r.incomeTax + r.localTax)}</td>`
    + `<td class="num"><strong>${P.won(r.net)}</strong></td></tr>`;
}

const pages = [...miscPages(rows), ...calcPages, ...calcPages2, ...calcPages3];

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
  `/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n\n/assets/*\n  Cache-Control: public, max-age=86400\n`);

console.log(`생성 완료: ${pages.length + 1}개 페이지, sitemap ${pages.length}개 URL`);
