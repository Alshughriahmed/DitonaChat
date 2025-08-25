"use client";
import { makeSocket, type SocketT } from '@/utils/socket';

import { useState, useEffect, useRef } from 'react';
interface DiagnosticData {
  timestamp: number;
  iceConnectionState: string;
  connectionState: string;
  signalingState: string;
  candidates: {
    local: Array<{ type: string; candidate: string; timestamp: number }>;
    remote: Array<{ type: string; candidate: string; timestamp: number }>;
  };
  timings: {
    offerStart?: number;
    offerComplete?: number;
    answerStart?: number;
    answerComplete?: number;
    iceGatheringStart?: number;
    iceGatheringComplete?: number;
    connected?: number;
  };
  streams: {
    local: boolean;
    remote: boolean;
  };
}

export default function WebRTCDiagPage() {
  const [diagnostics, setDiagnostics] = useState<DiagnosticData>({
    timestamp: Date.now(),
    iceConnectionState: 'new',
    connectionState: 'new', 
    signalingState: 'stable',
    candidates: { local: [], remote: [] },
    timings: {},
    streams: { local: false, remote: false }
  });
  
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const startTimeRef = useRef<number>(0);
  
  const addLog = (message: string) => {
    const timestamp = new Date().toISOString().substr(11, 12);
    setLogs(prev => [...prev.slice(-49), `[${timestamp}] ${message}`]);
  };
  
  const updateTimings = (event: string) => {
    const now = Date.now();
    setDiagnostics(prev => ({
      ...prev,
      timings: {
        ...prev.timings,
        [event]: now - startTimeRef.current
      }
    }));
  };
  
  const parseCandidate = (candidate: string): { type: string; protocol?: string } => {
    const parts = candidate.split(' ');
    let type = 'unknown';
    
    if (candidate.includes('typ host')) type = 'host';
    else if (candidate.includes('typ srflx')) type = 'srflx';
    else if (candidate.includes('typ relay')) type = 'relay';
    else if (candidate.includes('typ prflx')) type = 'prflx';
    
    return { type };
  };
  
  const startDiagnostics = async () => {
    setIsRunning(true);
    startTimeRef.current = Date.now();
    addLog('Starting WebRTC diagnostics...');
    
    try {
      // Get TURN configuration
      const turnResponse = await fetch('/api/turn');
      const turnConfig = await turnResponse.json();
      addLog(`TURN config: ${turnConfig.iceServers.length} servers`);
      
      // Create peer connection
      const pc = new RTCPeerConnection({
        iceServers: turnConfig.iceServers
      });
      pcRef.current = pc;
      
      // State listeners
      pc.oniceconnectionstatechange = () => {
        const state = pc.iceConnectionState;
        addLog(`ICE connection: ${state}`);
        if (state === 'connected' || state === 'completed') {
          updateTimings('connected');
        }
        setDiagnostics(prev => ({ ...prev, iceConnectionState: state }));
      };
      
      pc.onconnectionstatechange = () => {
        const state = pc.connectionState;
        addLog(`Connection: ${state}`);
        setDiagnostics(prev => ({ ...prev, connectionState: state }));
      };
      
      pc.onsignalingstatechange = () => {
        const state = pc.signalingState;
        addLog(`Signaling: ${state}`);
        setDiagnostics(prev => ({ ...prev, signalingState: state }));
      };
      
      // ICE candidate collection
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          const candidateInfo = parseCandidate(event.candidate.candidate);
          addLog(`Local candidate: ${candidateInfo.type}`);
          
          setDiagnostics(prev => ({
            ...prev,
            candidates: {
              ...prev.candidates,
              local: [...prev.candidates.local, {
                type: candidateInfo.type,
                candidate: event.candidate!.candidate,
                timestamp: Date.now() - startTimeRef.current
              }]
            }
          }));
        } else {
          updateTimings('iceGatheringComplete');
          addLog('ICE gathering complete');
        }
      };
      
      pc.onicegatheringstatechange = () => {
        const state = pc.iceGatheringState;
        addLog(`ICE gathering: ${state}`);
        if (state === 'gathering') {
          updateTimings('iceGatheringStart');
        }
      };
      
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: { echoCancellation: true, noiseSuppression: true }
      });
      
      stream.getTracks().forEach(track => pc.addTrack(track, stream));
      addLog('Local stream added');
      setDiagnostics(prev => ({ ...prev, streams: { ...prev.streams, local: true } }));
      
      // Create offer
      updateTimings('offerStart');
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      updateTimings('offerComplete');
      addLog('Offer created and set');
      
      // For diagnostics, we can simulate receiving an answer
      addLog('Diagnostics complete - check candidate types and timings');
      
    } catch (error) {
      addLog(`Error: ${error}`);
    }
  };
  
  const stopDiagnostics = () => {
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    setIsRunning(false);
    addLog('Diagnostics stopped');
  };
  
  const exportData = () => {
    const data = {
      ...diagnostics,
      logs,
      exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `webrtc-diag-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  const getCandidateCounts = () => {
    const local = diagnostics.candidates.local;
    const counts = {
      host: local.filter(c => c.type === 'host').length,
      srflx: local.filter(c => c.type === 'srflx').length,
      relay: local.filter(c => c.type === 'relay').length
    };
    return counts;
  };
  
  const candidateCounts = getCandidateCounts();
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">WebRTC Diagnostics</h1>
      
      <div className="mb-6 space-x-4">
        <button
          onClick={startDiagnostics}
          disabled={isRunning}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
        >
          Start Diagnostics
        </button>
        <button
          onClick={stopDiagnostics}
          disabled={!isRunning}
          className="px-4 py-2 bg-red-500 text-white rounded disabled:bg-gray-300"
        >
          Stop
        </button>
        <button
          onClick={exportData}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Export JSON
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* States */}
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="font-semibold mb-2">Connection States</h3>
          <div className="space-y-1 text-sm">
            <div>ICE: <span className="font-mono">{diagnostics.iceConnectionState}</span></div>
            <div>Connection: <span className="font-mono">{diagnostics.connectionState}</span></div>
            <div>Signaling: <span className="font-mono">{diagnostics.signalingState}</span></div>
          </div>
        </div>
        
        {/* Candidates */}
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="font-semibold mb-2">ICE Candidates</h3>
          <div className="space-y-1 text-sm">
            <div>Host: {candidateCounts.host}</div>
            <div>Server Reflexive: {candidateCounts.srflx}</div>
            <div>Relay: {candidateCounts.relay}</div>
            <div>Total: {diagnostics.candidates.local.length}</div>
          </div>
        </div>
        
        {/* Timings */}
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="font-semibold mb-2">Timings (ms)</h3>
          <div className="space-y-1 text-sm">
            {diagnostics.timings.offerComplete && (
              <div>Offer: {diagnostics.timings.offerComplete}ms</div>
            )}
            {diagnostics.timings.iceGatheringComplete && (
              <div>ICE Gathering: {diagnostics.timings.iceGatheringComplete}ms</div>
            )}
            {diagnostics.timings.connected && (
              <div>Connected: {diagnostics.timings.connected}ms</div>
            )}
          </div>
        </div>
        
        {/* Streams */}
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="font-semibold mb-2">Media Streams</h3>
          <div className="space-y-1 text-sm">
            <div>Local: {diagnostics.streams.local ? '✅' : '❌'}</div>
            <div>Remote: {diagnostics.streams.remote ? '✅' : '❌'}</div>
          </div>
        </div>
      </div>
      
      {/* Logs */}
      <div className="mt-6 bg-black text-green-400 p-4 rounded font-mono text-sm h-64 overflow-y-auto">
        <h3 className="text-white mb-2">Live Logs</h3>
        {logs.map((log, i) => (
          <div key={i}>{log}</div>
        ))}
      </div>
    </div>
  );
}
