// components/Chat.js
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:5000');

const Chat = ({ userId }) => {
  const [match, setMatch] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  // Join user room and fetch match
  useEffect(() => {
    if (userId) {
      socket.emit('joinRoom', userId);

      axios.get(`http://localhost:5000/api/match/${userId}`)
      .then(res => setMatch(res.data))
      .catch(err => {
        console.error('Could not fetch match:', err);
        setMatch(null); // avoid crashing
      });
    }
  }, [userId]);

  // Receive messages
  useEffect(() => {
    socket.on('receiveMessage', msg => {
      setMessages(prev => [...prev, { ...msg, sender: 'them' }]);
    });

    return () => {
      socket.off('receiveMessage');
    };
  }, []);

  useEffect(() => {
  const chatBox = document.getElementById("chat-box");
  if (chatBox) chatBox.scrollTop = chatBox.scrollHeight;
}, [messages]);


  const sendMessage = () => {
    if (message.trim() && match?.matchId) {
      const payload = {
        sender: userId,
        receiver: match.matchId,
        content: message
      };
      console.log("Sending message:", payload); 
      socket.emit('sendMessage', payload);
      setMessages(prev => [...prev, { content: message, sender: 'you', timestamp: new Date() }]);
      setMessage('');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h3>Chat with {match?.matchName|| 'your match'}</h3>
      <div style={{ height: '200px', overflowY: 'auto', border: '1px solid #ccc', marginBottom: 10 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ textAlign: msg.sender === 'you' ? 'right' : 'left' }}>
            <p><strong>{msg.sender}:</strong> {msg.content}</p>
            <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>
          </div>
        ))}
      </div>
      <input
        value={message}
        onChange={e => setMessage(e.target.value)}
        placeholder="Type your message..."
      />
      <button onClick={sendMessage} disabled={!message.trim()}>Send</button>
    </div>
  );
};

export default Chat;
