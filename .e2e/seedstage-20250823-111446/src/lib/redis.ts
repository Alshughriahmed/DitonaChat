// @ts-nocheck
import type { Redis as UpstashType } from "@upstash/redis";
import { Redis as UpstashRedis } from "@upstash/redis";

const DISABLED = process.env.DISABLE_REDIS === "1";
const REST_URL = process.env.UPSTASH_REDIS_REST_URL;
const REST_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

export type RedisLike = {
  ping(): Promise<string>;
  get(key: string): Promise<string | null>;
  set(key: string, val: string, ...args: any[]): Promise<"OK" | string | null>;
  lrange(key: string, start: number, stop: number): Promise<string[]>;
  lpush(key: string, ...vals: string[]): Promise<number>;
  rpush(key: string, ...vals: string[]): Promise<number>;
  lpop(key: string): Promise<string | null>;
  rpop(key: string): Promise<string | null>;
  lrem(key: string, count: number, value: string): Promise<number>;
};

class MemoryKV implements RedisLike {
  private kv = new Map<string, string>();
  private lists = new Map<string, string[]>();
  async ping() { return "PONG"; }
  async get(k: string) { return this.kv.get(k) ?? null; }
  async set(k: string, v: string, opts?: { EX?: number }) {
    this.kv.set(k, v); const ex = (opts as any)?.EX;
    if (typeof ex === "number") setTimeout(() => this.kv.delete(k), ex * 1000);
    return "OK";
  }
  private list(key: string) { let a=this.lists.get(key); if(!a){a=[];this.lists.set(key,a);} return a; }
  async lrange(k: string, s: number, e: number) {
    const a=this.list(k).slice(); const norm=(i:number)=>i<0?a.length+i:i;
    const S=Math.max(0,norm(s)); const E=norm(e); return a.slice(S, E===-1?undefined:E+1);
  }
  async lpush(k: string, ...vals: string[]) { const a=this.list(k); for(let i=vals.length-1;i>=0;i--) a.unshift(vals[i]); return a.length; }
  async rpush(k: string, ...vals: string[]) { const a=this.list(k); a.push(...vals); return a.length; }
  async lpop(k: string) { const a=this.list(k); return a.length ? (a.shift() ?? null) : null; }
  async rpop(k: string) { const a=this.list(k); return a.length ? (a.pop() ?? null) : null; }
  async lrem(k: string, cnt: number, v: string) {
    const a=this.list(k); let rem=0; const rm=(i:number)=>{a.splice(i,1);rem++;};
    if(cnt===0){ for(let i=a.length-1;i>=0;i--) if(a[i]===v) rm(i); }
    else if(cnt>0){ for(let i=0;i<a.length && rem<cnt;i++) if(a[i]===v){ rm(i); i--; } }
    else { const need=-cnt; for(let i=a.length-1;i>=0 && rem<need;i--) if(a[i]===v) rm(i); }
    return rem;
  }
}

function wrapUpstash(c: UpstashType): RedisLike {
  return {
    ping: () => c.ping(),
    get: (k) => c.get<string | null>(k),
    set: (k, v, ...args) => {
      if (args.length >= 2 && args[0] === "EX") return c.set(k, v, { ex: Number(args[1]) }).then(x => (x ?? "OK"));
      if (args.length === 1 && typeof args[0] === "object" && args[0]?.EX) return c.set(k, v, { ex: Number((args[0] as any).EX) }).then(x => (x ?? "OK"));
      return c.set(k, v).then(x => (x ?? "OK"));
    },
    lrange: (k, s, e) => c.lrange<string[]>(k, s, e),
    lpush: (k, ...vals) => c.lpush(k, ...vals),
    rpush: (k, ...vals) => c.rpush(k, ...vals),
    lpop: (k) => c.lpop<string>(k),
    rpop: (k) => c.rpop<string>(k),
    lrem: (k, cnt, v) => c.lrem(k, cnt, v),
  };
}

let redis: RedisLike;
if (DISABLED) {
  redis = new MemoryKV();
} else if (REST_URL && REST_TOKEN) {
  const client = new UpstashRedis({ url: REST_URL, token: REST_TOKEN });
  redis = wrapUpstash(client);
} else {
  redis = new MemoryKV();
}

export default redis;
export { redis };

export async function redisPing() { return redis.ping(); }
export async function redisGet(k: string) { return redis.get(k); }
export async function redisSet(k: string, v: string, opts?: { EX?: number }) {
  const isIoStyle = (redis as any).set.length >= 4;
  return isIoStyle ? (redis as any).set(k, v, ...(opts?.EX ? ["EX", opts.EX] : [])) : (redis as any).set(k, v, opts);
}
