import fs from 'fs';
import path from 'path';

const replacements = [
  { from: /#FDFCF9/gi, to: '#F2EFE9' },
  { from: /#F8F7F4/gi, to: '#F2EFE9' },
  { from: /#F8FAFC/gi, to: '#F2EFE9' },
  { from: /#f1f3f4/gi, to: '#F2EFE9' },
  { from: /#F1F3F0/gi, to: '#F2EFE9' },
  { from: /#1B4D4B/gi, to: '#047857' },
  { from: /#1A5F54/gi, to: '#047857' },
  { from: /#065F46/gi, to: '#047857' },
  { from: /#0e4d3a/gi, to: '#047857' },
  { from: /#111111/gi, to: '#242424' },
  { from: /#222/gi, to: '#242424' },
  { from: /#1e1a4b/gi, to: '#242424' },
  { from: /#FDFCF9/gi, to: '#F2EFE9' }
];

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== '.git') {
        walk(fullPath);
      }
    } else if (file.endsWith('.tsx') || file.endsWith('.ts') || file.endsWith('.html')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let changed = false;
      for (const r of replacements) {
        if (r.from.test(content)) {
          content = content.replace(r.from, r.to);
          changed = true;
        }
      }
      if (changed) {
        fs.writeFileSync(fullPath, content);
        console.log(`Updated: ${fullPath}`);
      }
    }
  }
}

walk('.');
