const fs = require('fs');
const path = 'src/app/chat/page.tsx';
let s = fs.readFileSync(path, 'utf8');

// 1) احذف أي تعريفات للستيت (هذه المتغيّرات الثلاثة) أينما كانت (خصوصاً داخل useEffect)
const del = (re) => s = s.replace(re, '');
del(/^\s*const\s*\[\s*composerOpen\s*,\s*setComposerOpen\s*\]\s*=\s*React\.useState\([^\n]*\);\s*$/gm);
del(/^\s*const\s*\[\s*dockMode\s*,\s*setDockMode\s*\]\s*=\s*React\.useState<[^>]*>\([^\n]*\);\s*$/gm);
del(/^\s*const\s*\[\s*messages\s*,\s*setMessages\s*\]\s*=\s*React\.useState<[^>]*>\([^\n]*\);\s*$/gm);

// 2) حدّد موضع الإدراج: بعد "use client" ثم آخر import
let insertAt = 0, lastImportEnd = 0;
for (const m of s.matchAll(/^import[\s\S]*?;\s*$/gm)) lastImportEnd = m.index + m[0].length;
const uc = s.match(/^\s*['"]use client['"];\s*/m);
insertAt = Math.max(lastImportEnd, uc ? uc.index + uc[0].length : 0);

// 3) حضّر الأسطر المراد إدراجها إن لم تكن موجودة أصلاً
const ins = [];
if (!/type\s+Msg\s*=/.test(s)) {
  ins.push('type Msg = { id: string; from: "me" | "peer"; text: string; ts?: number };');
}
if (!/const\s*\[\s*composerOpen\s*,\s*setComposerOpen\s*\]/.test(s)) {
  ins.push('const [composerOpen, setComposerOpen] = React.useState(false);');
}
if (!/const\s*\[\s*dockMode\s*,\s*setDockMode\s*\]/.test(s)) {
  ins.push('const [dockMode, setDockMode] = React.useState<"latest"|"history">("latest");');
}
if (!/const\s*\[\s*messages\s*,\s*setMessages\s*\]/.test(s)) {
  ins.push('const [messages, setMessages] = React.useState<Msg[]>([]);');
}

// 4) أدخلها بعد الاستيرادات
if (ins.length) {
  s = s.slice(0, insertAt) + '\n' + ins.join('\n') + '\n' + s.slice(insertAt);
}

fs.writeFileSync(path, s);
console.log('[PATCHED] Moved state definitions to top of file:', path);
