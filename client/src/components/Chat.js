import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';

const SERVER_URL = 'http://localhost:5000';

export default function Chat({ username }){
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const socketRef = useRef();
  const messagesRef = useRef();

  useEffect(() => {
    socketRef.current = io(SERVER_URL);
    socketRef.current.emit('join', username);

    socketRef.current.on('chat-message', data => {
      setMessages(prev => [...prev, data]);
    });

    fetch(`${SERVER_URL}/messages`).then(r => r.json()).then(list => {
      const mapped = list.map(m => ({ user: m.from, msg: m.text, createdAt: m.createdAt }));
      setMessages(mapped);
    });

    return () => socketRef.current.disconnect();
  }, [username]);

  useEffect(() => {
    if(messagesRef.current) messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [messages]);

  function sendMessage(){
    if(!input.trim()) return;
    const payload = { user: username, msg: input.trim() };
    socketRef.current.emit('chat-message', payload);
    setInput('');
  }

  return (
    <div id="chat-container">
      <ul id="messages" ref={messagesRef}>
        {messages.map((m, idx) => (
          <li key={idx} className={m.user === username ? 'self' : 'other'}>
            <span className="username">{m.user}</span>
            <div className="bubble">{m.msg}</div>
            <span className="timestamp">{new Date(m.createdAt).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
          </li>
        ))}
      </ul>

      <div id="form">
        <input id="input" value={input} onChange={e=>setInput(e.target.value)} placeholder="Type a message..." onKeyDown={e => e.key === 'Enter' && sendMessage()} />
        <button id="send" onClick={sendMessage}>➤</button>
      </div>
    </div>
  );
}
