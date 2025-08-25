/**
 * Socket utility — sync API compatible with existing call sites.
 * Falls back to a no-op stub if socket.io-client isn't available.
 */

export type SocketLike = {
  on: (event: string, handler: (...args: any[]) => void) => void;
  off: (event: string, handler?: (...args: any[]) => void) => void;
  emit: (event: string, ...args: any[]) => void;
  close: () => void;
  disconnect: () => void; // alias for compatibility
  connected: boolean;
};

export type SocketT = SocketLike;

// Try to require socket.io-client (works in client bundles too)
function getIo(): any {
  let mod: any = null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    mod = require('socket.io-client');
  } catch {
    mod = null;
  }
  return mod?.io || mod?.default || null;
}

/**
 * Create a socket instance synchronously.
 * @param url optional base URL
 * @param opts socket.io-client options (path, transports, reconnection, etc.)
 */
export function makeSocket(url?: string, opts?: Record<string, any>): SocketLike {
  const io = getIo();

  if (!io) {
    // Dev stub (no external deps). Keeps app functional without sockets.
    const handlers = new Map<string, Set<Function>>();
    const stub: SocketLike = {
      on: (e, h) => { if (!handlers.has(e)) handlers.set(e, new Set()); handlers.get(e)!.add(h); },
      off: (e, h) => { if (h) handlers.get(e)?.delete(h); else handlers.delete(e); },
      emit: () => { /* no-op */ },
      close: () => { handlers.clear(); },
      disconnect: () => { handlers.clear(); },
      connected: false,
    };
    if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.info('[socket][stub] running without socket.io-client (dev stub active)');
    }
    return stub;
  }

  const socket = io(url || undefined, {
    path: '/socket.io',
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 10,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    randomizationFactor: 0.5,
    timeout: 20000,
    autoConnect: true,
    withCredentials: false,
    ...(opts || {}),
  });

  // ensure disconnect alias exists
  if (typeof (socket as any).disconnect !== 'function' && typeof (socket as any).close === 'function') {
    (socket as any).disconnect = (socket as any).close.bind(socket);
  }

  return socket as SocketLike;
}

// Backwards-compat name used in some modules
export const getSocket = makeSocket;
