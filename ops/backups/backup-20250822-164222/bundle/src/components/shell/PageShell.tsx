'use client';
import { makeSocket, type SocketT } from '@/utils/socket';
import React from "react";
export default function PageShell({title,actions,children}:{title?:string;actions?:React.ReactNode;children:React.ReactNode}){
  return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-10 backdrop-blur bg-black/30 border-b border-white/10">
        <div className="mx-auto max-w-[1200px] px-4 py-3 flex items-center justify-between">
          <div className="font-bold">Ditonachat</div>
          <div className="flex items-center gap-2">{actions}</div>
        </div>
      </header>
      <div className="mx-auto max-w-[1200px] px-4 py-6">
        {title && <h1 className="text-2xl font-semibold mb-4">{title}</h1>}
        {children}
      </div>
      <footer className="mx-auto max-w-[1200px] px-4 py-10 opacity-70 text-sm">© Ditonachat</footer>
    </main>
  );
}
