import fs from 'fs';
import path from 'path';

const pagesDir = 'src/pages';
const files = fs.readdirSync(pagesDir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  let content = fs.readFileSync(path.join(pagesDir, file), 'utf8');
  content = content.replace(/hover:bg-secondary/g, 'hover:bg-[#218838]');
  content = content.replace(/hover:bg-muted/g, 'hover:bg-[#DEE2E6]');
  content = content.replace(/text-secondary(?!\-)/g, 'text-[#FD7E14]');
  fs.writeFileSync(path.join(pagesDir, file), content);
}
console.log('Done replacing buttons in pages.');
