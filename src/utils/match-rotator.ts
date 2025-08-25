type Peer = {
  id: string; name: string; gender: "male"|"female"|"couple"|"lgbt";
  country: string; region?: string; likes: number; vip?: boolean;
};
const demo: Peer[] = [
  { id:"p1", name:"Noura", gender:"female", country:"Kuwait", region:"Kuwait City", likes:12, vip:true },
  { id:"p2", name:"Salem", gender:"male",   country:"KSA",    region:"Riyadh",      likes:5 },
  { id:"p3", name:"Aya",   gender:"female", country:"Egypt",  region:"Cairo",       likes:19 },
  { id:"p4", name:"Omar",  gender:"male",   country:"UAE",    region:"Dubai",       likes:8 },
  { id:"p5", name:"Lina",  gender:"female", country:"Jordan", region:"Amman",       likes:3, vip:true },
];

const w: any = typeof window !== 'undefined' ? window : undefined;
function setIdx(i: number) {
  if (!w) return;
  const idx = ((i % demo.length) + demo.length) % demo.length;
  localStorage.setItem("matchIndex", String(idx));
  const peer = demo[idx];
  w.__MATCH_ID__ = peer.id;
  localStorage.setItem("currentMatchId", peer.id);
  document.dispatchEvent(new CustomEvent("match-change", { detail: { peer, idx }}));
}
function getIdx(): number {
  if (!w) return 0;
  const s = localStorage.getItem("matchIndex"); const n = s ? parseInt(s,10) : 0;
  return isNaN(n) ? 0 : Math.min(Math.max(n,0), demo.length-1);
}
export function currentPeer(): Peer {
  const idx = getIdx(); return demo[idx];
}
export function init(){
  if (!w) return;
  if (!localStorage.getItem("matchIndex")) setIdx(0); else setIdx(getIdx());
  // ربط أحداث الـBus
  import("./bus").then(({ on })=>{
    on("next",   ()=> setIdx(getIdx()+1));
    on("prev",   ()=> setIdx(getIdx()-1));
    on("like",   (e)=>{ /* available for future use */ });
  });
}
