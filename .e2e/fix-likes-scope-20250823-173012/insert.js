  const fs=require('fs'); const file=process.env.FILE||'src/app/chat/page.tsx';
  let src=fs.readFileSync(file,'utf8');
  if (src.includes('const [likesCount, setLikesCount]')) { process.exit(0); }
  const findFn = () => {
    let re = /export\s+default\s+function\s+ChatPage\s*\([^)]*\)\s*{|function\s+ChatPage\s*\([^)]*\)\s*{/g;
    let m = re.exec(src); if(!m) return null;
    let i = m.index + m[0].length - 1; // at '{'
    return i;
  };
  const braceIdx = findFn();
  if (braceIdx == null) { console.error("[ERR] ChatPage() not found"); process.exit(2); }
  const snippet = `
  // Local likes counter (user totals)
  const [likesCount, setLikesCount] = React.useState<number>(0);
  React.useEffect(() => {
    try {
      const v = Number(localStorage.getItem("myLikes") || "0");
      if (!Number.isNaN(v)) setLikesCount(v);
    } catch (e) {}
  }, []);
`;
  src = src.slice(0, braceIdx+1) + snippet + src.slice(braceIdx+1);
  fs.writeFileSync(file, src, 'utf8');
