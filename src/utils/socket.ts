"use client";
type Listener = (...args:any[])=>void;
class MiniBus {
  private map = new Map<string, Set<Listener>>();
  on(ev:string, fn:Listener){ if(!this.map.has(ev)) this.map.set(ev,new Set()); this.map.get(ev)!.add(fn); }
  off(ev:string, fn:Listener){ this.map.get(ev)?.delete(fn); }
  emit(ev:string, ...args:any[]){ console.debug("[socket.emit]", ev, ...args); this.map.get(ev)?.forEach(f=>{try{f(...args)}catch{}}); }
}
export function getSocket(){
  if (typeof window === "undefined") return null as any;
  const w = window as any;
  if (!w.__DITONA_SOCKET__) w.__DITONA_SOCKET__ = new MiniBus();
  return w.__DITONA_SOCKET__ as MiniBus;
}
export default getSocket;
