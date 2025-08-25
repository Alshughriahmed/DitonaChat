  const fs=require('fs'); const file=process.env.FILE||'src/app/chat/page.tsx';
  let src=fs.readFileSync(file,'utf8');
  if (src.includes('const [isVip, setIsVip]')) process.exit(0);

  // ابحث عن بداية جسم دالة ChatPage
  const re=/export\\s+default\\s+function\\s+ChatPage\\s*\\([^)]*\\)\\s*\\{|function\\s+ChatPage\\s*\\([^)]*\\)\\s*\\{/g;
  const m=re.exec(src);
  if(!m){ console.error("[ERR] ChatPage() not found"); process.exit(2); }
  const insertAt = m.index + m[0].length;

  const snippet = `
  // VIP flag (mock from localStorage for dev)
  const [isVip, setIsVip] = React.useState<boolean>(false);
  React.useEffect(() => {
    try { setIsVip((localStorage.getItem("isVip")||"0")==="1"); } catch(e){}
  }, []);
`;
  src = src.slice(0, insertAt) + snippet + src.slice(insertAt);
  fs.writeFileSync(file, src, 'utf8');
