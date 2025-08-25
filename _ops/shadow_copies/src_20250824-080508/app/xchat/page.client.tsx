
'use client';

import { useState, useEffect, useRef } from 'react';
import { makeSocket, type SocketT } from '@/utils/socket';

export default function XChatClient() {
  const [socket, setSocket] = useState<SocketT | null>(null);
  const [messages, setMessages] = useState<string[]>([]);
  const [connected, setConnected] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const socketInstance = makeSocket();
    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      setConnected(true);
      setMessages(prev => [...prev, 'Connected to server']);
    });

    socketInstance.on('disconnect', () => {
      setConnected(false);
      setMessages(prev => [...prev, 'Disconnected from server']);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (inputRef.current && socket) {
      const message = inputRef.current.value;
      if (message.trim()) {
        socket.emit('chat:message', { text: message });
        setMessages(prev => [...prev, `You: ${message}`]);
        inputRef.current.value = '';
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">XChat Debug</h1>
        <div className="mb-4">
          Status: <span className={connected ? 'text-green-400' : 'text-red-400'}>
            {connected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg mb-4 h-64 overflow-y-auto">
          {messages.map((msg, idx) => (
            <div key={idx} className="mb-1">{msg}</div>
          ))}
        </div>
        
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            className="flex-1 px-3 py-2 bg-gray-700 rounded"
            placeholder="Type a message..."
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
