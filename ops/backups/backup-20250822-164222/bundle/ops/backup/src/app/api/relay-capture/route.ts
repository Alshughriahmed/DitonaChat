import { NextResponse } from "next/server";
let CANDS: string[] = [];
export async function POST(req: Request){ try{
  const b=await req.json().catch(()=>({})); const c=typeof b?.candidate==="string"?b.candidate:null;
  if(c) CANDS.push(c); return NextResponse.json({ok:true,count:CANDS.length});
}catch(e){return NextResponse.json({ok:false,error:String(e)},{status:400});}}
export async function GET(){ return NextResponse.json({ ok:true, candidates:CANDS }); }
export async function DELETE(){ CANDS=[]; return NextResponse.json({ ok:true, cleared:true }); }
