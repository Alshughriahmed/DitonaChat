"use client";
import { makeSocket, type SocketT } from '@/utils/socket';
import { useCallback, useEffect, useRef, useState } from 'react';

import { getBaseUrl } from '@/lib/runtime';
type Status = 'idle' | 'connecting' | 'enqueued' | 'waiting' | 'matched' | 'error';

export function useMatchingQueue() {
  const [status, setStatus] = useState<Status>('idle');
  const [roomId, setRoomId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>('');
  const [lastError, setLastError] = useState<string | null>(null);
  const socketRef = useRef<SocketT | null>(null);

  useEffect(() => { setUserId(`u_${Math.random().toString(36).slice(2,10)}`); }, []);

  useEffect(() => {
    if (!userId) return;
    setStatus('connecting');
    const baseUrl = getBaseUrl();
    const s = makeSocket(baseUrl, {
      path: '/socket.io',
      transports: ['polling'],  // ← نجبر polling
      upgrade: false,
      query: { userId },
      forceNew: true,
    });
    socketRef.current = s;

    s.on('connect', () => setStatus('idle'));
    s.on('connect_error', (e: any) => { setLastError(e.message); setStatus('error'); });
    s.on('matching:matchFound', (rid: string) => { setRoomId(rid); setStatus('matched'); });
    s.on('matching:noMatch', () => { if (status !== 'enqueued') setStatus('waiting'); });

    return () => { s.disconnect(); socketRef.current = null; };
  }, [userId]);

  const enqueue = useCallback(() => { socketRef.current?.emit('matching:enqueue'); setStatus('enqueued'); }, []);
  const leave   = useCallback(() => { socketRef.current?.emit('matching:leave'); setStatus('idle'); setRoomId(null); }, []);

  return { status, roomId, userId, lastError, enqueue, leave };
}
