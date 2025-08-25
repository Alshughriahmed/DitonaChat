'use client';
import { makeSocket, type SocketT } from '@/utils/socket';

import { useRef, useState, useCallback } from "react";
export function useDragPinch(init = { x: 16, y: 16, scale: 1 }) {
  const [pos, setPos] = useState({ x: init.x, y: init.y, scale: init.scale });
  const dragRef = useRef<{dx:number,dy:number,active:boolean}>({dx:0,dy:0,active:false});
  const pinchRef = useRef<{d0:number,active:boolean}>({d0:0,active:false});
  const onPointerDown = useCallback((e: any) => {
    e.target.setPointerCapture?.(e.pointerId);
    if (e.isPrimary !== false) dragRef.current = { dx: e.clientX - pos.x, dy: e.clientY - pos.y, active:true };
  }, [pos.x, pos.y]);
  const onPointerMove = useCallback((e: any) => {
    if (dragRef.current.active) {
      let x = e.clientX - dragRef.current.dx;
      let y = e.clientY - dragRef.current.dy;
      x = Math.max(8, Math.min(window.innerWidth - 180, x));
      y = Math.max(8, Math.min(window.innerHeight - 140, y));
      setPos(p => ({ ...p, x, y }));
    }
  }, []);
  const onPointerUp = useCallback(() => { dragRef.current.active = false; pinchRef.current.active = false; }, []);
  const onTouchStart = useCallback((e: any) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      pinchRef.current = { d0: Math.hypot(dx, dy), active:true };
    }
  }, []);
  const onTouchMove = useCallback((e: any) => {
    if (pinchRef.current.active && e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const d = Math.hypot(dx, dy);
      const k = d / Math.max(1, pinchRef.current.d0);
      setPos(p => ({ ...p, scale: Math.max(0.6, Math.min(2, p.scale * k)) }));
      pinchRef.current.d0 = d;
    }
  }, []);
  const onTouchEnd = useCallback(() => { pinchRef.current.active = false; }, []);
  return { pos, onPointerDown, onPointerMove, onPointerUp, onTouchStart, onTouchMove, onTouchEnd };
}
