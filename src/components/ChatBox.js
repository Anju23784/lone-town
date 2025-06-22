import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

function ChatBox({ userId, matchId }) {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.emit('joinRoom', userId);

    socket.on('receiveMessage', (msg) => {
      setChat(prev => [...prev, { from: 'them', ...msg }]);
    });

    socket.on('messageSent', (msg) => {
      setChat(prev => [...prev, { from: 'me', ...msg }]);
    });

    return () => {
      socket.off('receiveMessage');
      socket.off('messageSent');
    };
  }, [userId]);

  const sendMessage = () => {
    if (!message) return;
    socket.emit('sendMessage', {
      sender: userId,
      receiver: matchId,
      content: message
    });
    setMessage('');
  };

  return (
    <div style={{ marginTop: 20 }}>
      <h3>💬 Chat with your Match</h3>
      <div style={{ maxHeight: 200, overflowY: 'scroll', border: '1px solid #ccc', padding: 10 }}>
        {chat.map((msg, i) => (
          <div key={i} style={{ textAlign: msg.from === 'me' ? 'right' : 'left' }}>
            <p><strong>{msg.from === 'me' ? 'You' : 'Match'}:</strong> {msg.content}</p>
          </div>
        ))}
      </div>
      <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type a message" />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default ChatBox;
