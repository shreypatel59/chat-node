import React, { useState } from 'react';

export default function Login({ onLogin }){
  const [name, setName] = useState('');
  return (
    <div className="center-screen">
      <div className="login-card">
        <h2>Join Chat</h2>
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Enter your name"
        />
        <button onClick={() => name.trim() && onLogin(name.trim())}>Join</button>
      </div>
    </div>
  );
}
