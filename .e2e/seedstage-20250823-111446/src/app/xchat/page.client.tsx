
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { makeSocket, type SocketT } from '@/utils/socket';

export default function XChatClient() {
  const [socket, setSocket] = useState<SocketT | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const newSocket = makeSocket();
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setMessages(prev => [...prev, '✅ Connected to Socket.IO']);
    });

    newSocket.on('disconnect', () => {
      setMessages(prev => [...prev, '❌ Disconnected from Socket.IO']);
    });

    newSocket.on('message', (data: any) => {
      setMessages(prev => [...prev, `📨 ${JSON.stringify(data)}`]);
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (socket && inputValue.trim()) {
      socket.emit('message', inputValue);
      setMessages(prev => [...prev, `➡️ Sent: ${inputValue}`]);
      setInputValue('');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>XChat Debug Console</h1>
      
      <div style={{ 
        border: '1px solid #ccc', 
        height: '400px', 
        overflowY: 'auto', 
        padding: '10px', 
        marginBottom: '10px',
        backgroundColor: '#f9f9f9'
      }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ marginBottom: '5px', fontFamily: 'monospace' }}>
            {msg}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
          style={{ 
            flex: 1, 
            padding: '8px', 
            border: '1px solid #ccc',
            borderRadius: '4px'
          }}
        />
        <button 
          onClick={sendMessage}
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Send
        </button>
      </div>

      <div style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        Socket Status: {socket?.connected ? '🟢 Connected' : '🔴 Disconnected'}
      </div>
    </div>
  );
}
