const fs = require('fs');
const files = process.argv.slice(2);
for (const path of files) {
  let s = fs.readFileSync(path, 'utf8');

  // احذف تعريفات state من داخل أي useEffect
  s = s.replace(/useEffect\([^)]*\)\s*=>\s*\{[\s\S]*?\}/g, (block) => {
    return block
      .replace(/^\s*const\s*\[\s*composerOpen\s*,\s*setComposerOpen\s*\]\s*=\s*React\.useState\([^\n]*\);\s*$/gm, '')
      .replace(/^\s*const\s*\[\s*dockMode\s*,\s*setDockMode\s*\][^\n]*\n?/gm, '')
      .replace(/^\s*const\s*\[\s*messages\s*,\s*setMessages\s*\][^\n]*\n?/gm, '');
  });

  // موقع الإدراج: بعد 'use client' ثم الاستيرادات
  let insertAt = 0, lastImportEnd = 0;
  s.replace(/^import[\s\S]*?;\s*$/gm, (m, off) => { lastImportEnd = off + m.length; return m; });
  const uc = s.match(/^\s*['"]use client['"];\s*/m);
  insertAt = Math.max(lastImportEnd, uc ? uc.index + uc[0].length : 0);

  const ins = [];
  if (!/type\s+Msg\s*=/.test(s)) ins.push('type Msg = { id: string; from: "me" | "peer"; text: string; ts?: number };');
  if (!/const\s*\[\s*composerOpen\s*,\s*setComposerOpen\s*\]/.test(s)) ins.push('const [composerOpen, setComposerOpen] = React.useState(false);');
  if (!/const\s*\[\s*dockMode\s*,\s*setDockMode\s*\]/.test(s)) ins.push('const [dockMode, setDockMode] = React.useState<"latest"|"history">("latest");');
  if (!/const\s*\[\s*messages\s*,\s*setMessages\s*\]/.test(s)) ins.push('const [messages, setMessages] = React.useState<Msg[]>([]);');

  if (ins.length) s = s.slice(0, insertAt) + '\n' + ins.join('\n') + '\n' + s.slice(insertAt);

  fs.writeFileSync(path, s);
  console.log('[PATCHED]', path);
}
