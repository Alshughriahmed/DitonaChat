// @ts-nocheck
type Gender = "M"|"F"|"ANY";
type EnqueueReq = { userId?: string; gender?: Gender; tags?: string[]; safe?: boolean; };

const g = globalThis as any;
if (!g.__mockMatcher) {
  g.__mockMatcher = {
    q: [] as EnqueueReq[],
    put(req: EnqueueReq){ this.q.push(req); return { queued:true, size:this.q.length }; },
    cancel(userId?: string){ 
      if(!userId){ this.q = []; return { canceled:true, size:0 }; }
      const n = this.q.length;
      this.q = this.q.filter(x => x.userId !== userId);
      return { canceled:true, removed: n - this.q.length, size:this.q.length };
    },
    status(){ return { online:true, queued:this.q.length }; }
  };
}
export const mockMatcher = g.__mockMatcher;
