'use client';
import { makeSocket, type SocketT } from '@/utils/socket';
import React from "react";
export default function ChatShell({left,right,toolbar}:{left:React.ReactNode; right:React.ReactNode; toolbar:React.ReactNode;}){
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <section className="card p-3">{left}</section>
      <section className="card p-3">{right}</section>
      <div className="md:col-span-2 flex items-center gap-3">{toolbar}</div>
    </div>
  );
}
