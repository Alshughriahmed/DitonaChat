const fs = require('fs');
const path = 'src/app/chat/page.tsx';
let s = fs.readFileSync(path, 'utf8');

// جمع تعريفات الستايت (إن وُجدت) على مستوى الملف
const hookLines = [];
function pull(re){
  s = s.replace(re, (m)=>{ hookLines.push(m.trim()); return ''; });
}
pull(/^\s*const\s*\[\s*composerOpen\s*,\s*setComposerOpen\s*\]\s*=\s*React\.useState\([^\n]*\);\s*$/m);
pull(/^\s*const\s*\[\s*dockMode\s*,\s*setDockMode\s*\]\s*=\s*React\.useState<[^>]*>\([^\n]*\);\s*$/m);
pull(/^\s*const\s*\[\s*messages\s*,\s*setMessages\s*\]\s*=\s*React\.useState<[^>]*>\([^\n]*\);\s*$/m);

// لو ما عندنا ولا سطر، لا نتابع
if (!hookLines.length) {
  console.log('[INFO] No top-level hook lines found to move.');
  process.exit(0);
}

// العثور على بداية جسم المكوّن
let m = s.match(/export\s+default\s+function\s+([A-Za-z0-9_]+)\s*\([^)]*\)\s*\{/);
let insertAt = -1, indent = '  ';
if (m) {
  insertAt = m.index + m[0].length;
} else {
  // نمط آخر: const ChatPage = () => { ... } مع export default ChatPage لاحقًا
  m = s.match(/const\s+([A-Za-z0-9_]+)\s*=\s*\([^)]*\)\s*=>\s*\{/);
  if (m) insertAt = m.index + m[0].length;
}
if (insertAt < 0) {
  console.error('[ERROR] Could not find component function start to insert hooks.');
  process.exit(1);
}

// تحضير النص المدرج
const block =
`\n${indent}// === chat state (moved inside component) ===\n${indent}${hookLines.join(`\n${indent}`)}\n`;

// الإدراج
s = s.slice(0, insertAt) + block + s.slice(insertAt);

// تنظيف مسافات زائدة مزدوجة
s = s.replace(/\n{3,}/g, '\n\n');

fs.writeFileSync(path, s);
console.log('[PATCHED] Hooks moved inside component:', path);
