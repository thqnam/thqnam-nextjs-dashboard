'use client';

import React, { createContext, useContext, useState } from 'react';

type SessionInforContextType = {
  sessionId: string;
  setSessionId: (sessionId: string) => void;
  sessionName: string;
  setSessionName: (sessionName: string) => void;
  sessionEmail: string;
  setSessionEmail: (sessionEmail: string) => void;
  sessionImage: string;
  setSessionImage: (sessionImage: string) => void;
  sessionRole: string;
  setSessionRole: (sessionRole: string) => void;
};

const SessionInforContext = createContext<SessionInforContextType | undefined>(undefined);

export function SessionInforProvider({ children }: { children: React.ReactNode }) {
  const [sessionId, setSessionId] = useState('');
  const [sessionName, setSessionName] = useState('');
  const [sessionEmail, setSessionEmail] = useState('');
  const [sessionImage, setSessionImage] = useState('');
  const [sessionRole, setSessionRole] = useState('');
  return (
    <SessionInforContext.Provider value={{
      sessionId,
      setSessionId,
      sessionName,
      setSessionName,
      sessionEmail,
      setSessionEmail,
      sessionImage,
      setSessionImage,
      sessionRole,
      setSessionRole
    }}>
      {children}
    </SessionInforContext.Provider>
  );
}

export function useSessionInforContext() {
  const context = useContext(SessionInforContext);
  if (!context) throw new Error('useSessionInforContext must be used within SessionInforProvider');
  return context;
}