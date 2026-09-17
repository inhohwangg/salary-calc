/* 사용법: node scripts/set-domain.mjs mycalc.com  (도메인 확정 후 1회 실행) */
import fs from 'node:fs';
const d = process.argv[2];
if (!d) { console.error('도메인을 입력하세요. 예: node scripts/set-domain.mjs mycalc.com'); process.exit(1); }
const url = d.startsWith('http') ? d.replace(/\/$/, '') : 'https://' + d.replace(/\/$/, '');
const f = 'src/layout.mjs';
const s = fs.readFileSync(f, 'utf8').replace(/domain: '[^']*'/, `domain: '${url}'`);
fs.writeFileSync(f, s);
console.log(`도메인을 ${url} 로 바꿨습니다. 이제 npm run build 를 실행하세요.`);
