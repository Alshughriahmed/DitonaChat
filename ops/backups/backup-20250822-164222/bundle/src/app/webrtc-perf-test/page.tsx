"use client";
import { makeSocket, type SocketT } from '@/utils/socket';

import React, { useRef, useState, useEffect } from 'react';
interface CandidateLog {
  type: string;
  timestamp: number;
  candidate: string;
  protocol?: string;
  address?: string;
}

interface NegotiationMetrics {
  startTime: number;
  offerCreated?: number;
  answerCreated?: number;
  iceGatheringComplete?: number;
  iceConnected?: number;
  connectionEstablished?: number;
  candidateTypes: string[];
  candidateLogs: CandidateLog[];
  errors: string[];
}

export default function WebRTCPerfTestPage() {
  const [metrics, setMetrics] = useState<NegotiationMetrics>({
    startTime: 0,
    candidateTypes: [],
    candidateLogs: [],
    errors: []
  });
  
  const [connectionState, setConnectionState] = useState<string>('new');
  const [iceConnectionState, setIceConnectionState] = useState<string>('new');
  const [turnServers, setTurnServers] = useState<any[]>([]);
  const [isTestRunning, setIsTestRunning] = useState(false);
  
  const pcRef = useRef<RTCPeerConnection | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // Load TURN servers
  useEffect(() => {
    fetch('/api/turn')
      .then(res => res.json())
      .then(data => {
        const servers = Array.isArray(data) ? data : (data.iceServers || []);
        setTurnServers(servers);
        console.log('[PERF-TEST] TURN servers loaded:', servers.length);
      })
      .catch(err => {
        console.error('[PERF-TEST] Failed to load TURN servers:', err);
        setMetrics(prev => ({
          ...prev,
          errors: [...prev.errors, `TURN load failed: ${err.message}`]
        }));
      });
  }, []);

  const logCandidate = (candidate: RTCIceCandidate, direction: 'local' | 'remote') => {
    const timestamp = Date.now();
    const candidateStr = candidate.candidate;
    
    // Parse candidate type
    let candidateType = 'unknown';
    let protocol = '';
    let address = '';
    
    if (candidateStr.includes('typ host')) candidateType = 'host';
    else if (candidateStr.includes('typ srflx')) candidateType = 'srflx';
    else if (candidateStr.includes('typ relay')) candidateType = 'relay';
    else if (candidateStr.includes('typ prflx')) candidateType = 'prflx';
    
    const protocolMatch = candidateStr.match(/tcp|udp/);
    if (protocolMatch) protocol = protocolMatch[0];
    
    const addressMatch = candidateStr.match(/(\d+\.\d+\.\d+\.\d+)/);
    if (addressMatch) address = addressMatch[1];

    const logEntry: CandidateLog = {
      type: `${direction}-${candidateType}`,
      timestamp,
      candidate: candidateStr,
      protocol,
      address
    };

    setMetrics(prev => {
      const newTypes = [...new Set([...prev.candidateTypes, candidateType])];
      return {
        ...prev,
        candidateTypes: newTypes,
        candidateLogs: [...prev.candidateLogs, logEntry]
      };
    });

    console.log(`[PERF-TEST] ${direction} candidate (${candidateType}):`, candidateStr);
  };

  const updateMetric = (key: keyof NegotiationMetrics, value: any) => {
    setMetrics(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const addError = (error: string) => {
    setMetrics(prev => ({
      ...prev,
      errors: [...prev.errors, error]
    }));
  };

  const startTest = async () => {
    try {
      setIsTestRunning(true);
      const startTime = Date.now();
      
      setMetrics({
        startTime,
        candidateTypes: [],
        candidateLogs: [],
        errors: []
      });

      console.log('[PERF-TEST] Starting WebRTC performance test...');

      // Create peer connection with TURN servers
      const config: RTCConfiguration = {
        iceServers: turnServers,
        iceCandidatePoolSize: 10
      };

      const pc = new RTCPeerConnection(config);
      pcRef.current = pc;

      // Monitor connection states
      pc.onconnectionstatechange = () => {
        const state = pc.connectionState;
        setConnectionState(state);
        console.log('[PERF-TEST] Connection state:', state);
        
        if (state === 'connected') {
          updateMetric('connectionEstablished', Date.now());
        }
      };

      pc.oniceconnectionstatechange = () => {
        const state = pc.iceConnectionState;
        setIceConnectionState(state);
        console.log('[PERF-TEST] ICE connection state:', state);
        
        if (state === 'connected') {
          updateMetric('iceConnected', Date.now());
        }
      };

      pc.onicegatheringstatechange = () => {
        console.log('[PERF-TEST] ICE gathering state:', pc.iceGatheringState);
        if (pc.iceGatheringState === 'complete') {
          updateMetric('iceGatheringComplete', Date.now());
        }
      };

      // Log ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate) {
          logCandidate(event.candidate, 'local');
        } else {
          console.log('[PERF-TEST] ICE gathering completed');
        }
      };

      // Handle remote stream
      pc.ontrack = (event) => {
        console.log('[PERF-TEST] Remote track received');
        if (remoteVideoRef.current && event.streams[0]) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
      };

      // Get user media
      console.log('[PERF-TEST] Requesting user media...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Add tracks to peer connection
      stream.getTracks().forEach(track => {
        pc.addTrack(track, stream);
      });

      // Create offer (simulate caller behavior)
      console.log('[PERF-TEST] Creating offer...');
      const offer = await pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      });
      
      updateMetric('offerCreated', Date.now());
      await pc.setLocalDescription(offer);

      // Simulate remote peer behavior (set remote description = local description for loopback test)
      setTimeout(async () => {
        try {
          console.log('[PERF-TEST] Setting remote description (loopback)...');
          await pc.setRemoteDescription(offer);
          
          const answer = await pc.createAnswer();
          updateMetric('answerCreated', Date.now());
          await pc.setLocalDescription(answer);
          
          console.log('[PERF-TEST] Loopback negotiation completed');
        } catch (err: any) {
          addError(`Loopback error: ${err.message}`);
          console.error('[PERF-TEST] Loopback error:', err);
        }
      }, 100);

    } catch (err: any) {
      addError(`Test error: ${err.message}`);
      console.error('[PERF-TEST] Test error:', err);
      setIsTestRunning(false);
    }
  };

  const stopTest = () => {
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    
    if (localVideoRef.current?.srcObject) {
      const stream = localVideoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      localVideoRef.current.srcObject = null;
    }
    
    if (remoteVideoRef.current?.srcObject) {
      remoteVideoRef.current.srcObject = null;
    }
    
    setIsTestRunning(false);
    setConnectionState('new');
    setIceConnectionState('new');
  };

  const calculateDuration = (start?: number, end?: number) => {
    if (!start || !end) return 'N/A';
    return `${end - start}ms`;
  };

  const generateReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      turnServers: turnServers.length,
      hasTURN: turnServers.some(s => s.urls?.includes('turn:')),
      metrics: {
        totalDuration: calculateDuration(metrics.startTime, metrics.connectionEstablished),
        offerTime: calculateDuration(metrics.startTime, metrics.offerCreated),
        answerTime: calculateDuration(metrics.offerCreated, metrics.answerCreated),
        iceGatheringTime: calculateDuration(metrics.startTime, metrics.iceGatheringComplete),
        iceConnectionTime: calculateDuration(metrics.startTime, metrics.iceConnected),
        candidateTypes: metrics.candidateTypes,
        candidateCount: metrics.candidateLogs.length,
        errors: metrics.errors
      },
      candidateLogs: metrics.candidateLogs,
      finalStates: {
        connection: connectionState,
        iceConnection: iceConnectionState
      }
    };

    console.log('[PERF-TEST] Generated report:', report);
    return JSON.stringify(report, null, 2);
  };

  return (
    <div style={{ padding: 20, background: '#0a0a0a', color: '#fff', minHeight: '100vh' }}>
      <h1>WebRTC Performance Test</h1>
      
      <div style={{ marginBottom: 20 }}>
        <p><strong>TURN Servers:</strong> {turnServers.length}</p>
        <p><strong>Has TURN:</strong> {turnServers.some(s => s.urls?.includes('turn:')) ? 'Yes' : 'No'}</p>
        <p><strong>Connection State:</strong> {connectionState}</p>
        <p><strong>ICE Connection State:</strong> {iceConnectionState}</p>
      </div>

      <div style={{ marginBottom: 20 }}>
        <button 
          onClick={startTest} 
          disabled={isTestRunning}
          style={{ 
            padding: '10px 20px', 
            marginRight: 10, 
            backgroundColor: isTestRunning ? '#666' : '#0066cc',
            color: '#fff',
            border: 'none',
            borderRadius: 5,
            cursor: isTestRunning ? 'not-allowed' : 'pointer'
          }}
        >
          {isTestRunning ? 'Testing...' : 'Start Test'}
        </button>
        
        <button 
          onClick={stopTest}
          style={{ 
            padding: '10px 20px',
            backgroundColor: '#cc0000',
            color: '#fff',
            border: 'none',
            borderRadius: 5,
            cursor: 'pointer'
          }}
        >
          Stop Test
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <div>
          <h3>Local Video</h3>
          <video 
            ref={localVideoRef} 
            autoPlay 
            muted 
            playsInline 
            style={{ width: '100%', background: '#222', borderRadius: 8 }}
          />
        </div>
        <div>
          <h3>Remote Video</h3>
          <video 
            ref={remoteVideoRef} 
            autoPlay 
            playsInline 
            style={{ width: '100%', background: '#222', borderRadius: 8 }}
          />
        </div>
      </div>

      <div style={{ marginBottom: 20 }}>
        <h3>Timing Metrics</h3>
        <ul>
          <li>Offer Created: {calculateDuration(metrics.startTime, metrics.offerCreated)}</li>
          <li>Answer Created: {calculateDuration(metrics.offerCreated, metrics.answerCreated)}</li>
          <li>ICE Gathering Complete: {calculateDuration(metrics.startTime, metrics.iceGatheringComplete)}</li>
          <li>ICE Connected: {calculateDuration(metrics.startTime, metrics.iceConnected)}</li>
          <li>Connection Established: {calculateDuration(metrics.startTime, metrics.connectionEstablished)}</li>
        </ul>
      </div>

      <div style={{ marginBottom: 20 }}>
        <h3>Candidate Types Found</h3>
        <p>{metrics.candidateTypes.join(', ') || 'None yet'}</p>
        <p>Total Candidates: {metrics.candidateLogs.length}</p>
      </div>

      {metrics.errors.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <h3>Errors</h3>
          <ul style={{ color: '#ff6666' }}>
            {metrics.errors.map((error, i) => (
              <li key={i}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h3>Detailed Report</h3>
        <button 
          onClick={() => {
            const report = generateReport();
            navigator.clipboard?.writeText(report);
            alert('Report copied to clipboard!');
          }}
          style={{ 
            padding: '5px 15px', 
            marginBottom: 10,
            backgroundColor: '#006600',
            color: '#fff',
            border: 'none',
            borderRadius: 3,
            cursor: 'pointer'
          }}
        >
          Copy Report to Clipboard
        </button>
        <pre style={{ 
          background: '#111', 
          padding: 15, 
          borderRadius: 5, 
          fontSize: 12,
          overflow: 'auto',
          maxHeight: 400
        }}>
          {JSON.stringify({
            candidateTypes: metrics.candidateTypes,
            candidateCount: metrics.candidateLogs.length,
            recentCandidates: metrics.candidateLogs.slice(-5),
            timing: {
              offer: calculateDuration(metrics.startTime, metrics.offerCreated),
              answer: calculateDuration(metrics.offerCreated, metrics.answerCreated),
              iceGathering: calculateDuration(metrics.startTime, metrics.iceGatheringComplete),
              iceConnection: calculateDuration(metrics.startTime, metrics.iceConnected)
            },
            states: { connectionState, iceConnectionState },
            errors: metrics.errors
          }, null, 2)}
        </pre>
      </div>
    </div>
  );
}
