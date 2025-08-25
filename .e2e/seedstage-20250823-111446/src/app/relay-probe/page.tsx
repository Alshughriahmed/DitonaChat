"use client";
import { makeSocket, type SocketT } from '@/utils/socket';

import React from 'react';
export default function RelayProbePage() {
  const [logs, setLogs] = React.useState<string[]>([]);
  const log = (m: string) => setLogs((x) => [...x, m]);

  React.useEffect(() => {
    (async () => {
      try {
        log('[probe] fetching /api/turn ...');
        const turn = await fetch('/api/turn', { cache: 'no-store' }).then(r=>r.json());
        const iceServers = turn.iceServers ?? [];
        log('[probe] got iceServers=' + iceServers.length);

        const pc = new RTCPeerConnection({ iceServers, iceTransportPolicy: 'relay' as any });
        pc.onicecandidate = (e) => {
          if (e.candidate) {
            const c = e.candidate.candidate;
            log('CAND: ' + c);
            fetch('/api/relay-capture', {
              method: 'POST',
              headers: {'content-type':'application/json'},
              body: JSON.stringify({ candidate: c }),
            }).catch(()=>{});
          }
        };
        pc.onicegatheringstatechange = () => log('[probe] iceGatheringState=' + pc.iceGatheringState);
        pc.createDataChannel('t');
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        setTimeout(()=>pc.close(), 8000);
      } catch (e: any) {
        log('[probe] error: ' + (e?.message || String(e)));
      }
    })();
  }, []);

  return (
    <main className="p-6 font-mono text-sm">
      <h1 className="text-lg font-bold mb-2">Relay Probe</h1>
      <p>iceTransportPolicy=<b>relay</b>. افتح Console إن أردت.</p>
      <pre className="mt-4 whitespace-pre-wrap">{logs.join('\n')}</pre>
    </main>
  );
}
