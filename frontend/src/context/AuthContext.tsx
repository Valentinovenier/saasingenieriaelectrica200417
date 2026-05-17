import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AuthContextType {
  userId: string | null;
  setUserId: (id: string | null) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const getInitialUserId = () => {
    const params = new URLSearchParams(window.location.search);
    const operatorId = params.get('operator_id');
    if (operatorId) {
      localStorage.setItem('userId', operatorId);
      return operatorId;
    }
    return localStorage.getItem('userId');
  };

  const [userId, setUserId] = useState<string | null>(getInitialUserId());

  const login = (id: string | null) => {
    setUserId(id);
    if (id) {
      localStorage.setItem('userId', id);
    } else {
      localStorage.removeItem('userId');
    }
  };

  const logout = () => {
    setUserId(null);
    localStorage.removeItem('userId');
  };

  return (
    <AuthContext.Provider value={{ userId, setUserId: login, isAuthenticated: !!userId }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
