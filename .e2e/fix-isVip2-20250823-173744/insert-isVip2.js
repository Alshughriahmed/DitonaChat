  const fs=require('fs'); const file=process.env.FILE||'src/app/chat/page.tsx';
  let s=fs.readFileSync(file,'utf8');
  if (s.includes('const [isVip, setIsVip]')) process.exit(0);

  const snippet = `
  // VIP flag (dev/mock)
  const [isVip, setIsVip] = React.useState(false);
  React.useEffect(()=>{ try{ setIsVip((localStorage.getItem('isVip')||'0')==='1'); }catch{} },[]);
`;

  function tryInsert(re){
    const m = re.exec(s);
    if(!m) return false;
    // أدخل مباشرة بعد أول '{' التي تلي تعريف الدالة
    const openIdx = s.indexOf('{', m.index);
    if (openIdx === -1) return false;
    const i = openIdx+1;
    s = s.slice(0,i) + snippet + s.slice(i);
    return true;
  }

  const patterns = [
    /export\s+default\s+function\s+ChatPage[\s\S]*?\(/m,
    /function\s+ChatPage[\s\S]*?\(/m,
    /const\s+ChatPage[\s\S]*?=>\s*\{/m,
    /export\s+default\s+function\s+Page[\s\S]*?\(/m,
    /function\s+Page[\s\S]*?\(/m,
    /const\s+Page[\s\S]*?=>\s*\{/m,
    /export\s+default\s*\([\s\S]*?\)\s*=>\s*\{/m
  ];

  let ok=false;
  for (const re of patterns){ if(tryInsert(re)){ ok=true; break; } }
  if(!ok){
    // آخر حل: قبل أول return (
    const r = s.indexOf('return (');
    if (r!==-1){ s = s.slice(0,r) + snippet + s.slice(r); ok=true; }
  }
  if(!ok){ console.error("[ERR] NO_INSERT_POINT"); process.exit(2); }

  fs.writeFileSync(file,s,'utf8');
