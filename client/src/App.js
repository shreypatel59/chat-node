import React, { useState } from 'react';
import Login from './components/Login';
import Chat from './components/Chat';

export default function App(){
  const [username, setUsername] = useState('');
  return (
    <>
      {!username ? (
        <Login onLogin={(name)=> setUsername(name)} />
      ) : (
        <Chat username={username} />
      )}
    </>
  );
}
