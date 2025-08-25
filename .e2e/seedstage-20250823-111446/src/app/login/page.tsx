"use client";
import Link from "next/link";
export default function Login(){
  return (
    <main style={{minHeight:"100dvh", display:"grid", placeItems:"center", color:"#fff",
                  background:"linear-gradient(180deg, #0b0b12, #141421)"}}>
      <div style={{textAlign:"center"}}>
        <h1 style={{fontSize:32, fontWeight:900, marginBottom:6}}>Log in</h1>
        <p style={{opacity:.8, marginBottom:16}}>Coming soon…</p>
        <Link href="/home" style={{textDecoration:"underline"}}>Back to home</Link>
      </div>
    </main>
  );
}
