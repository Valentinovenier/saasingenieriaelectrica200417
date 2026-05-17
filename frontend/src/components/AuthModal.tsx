import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const AuthModal = ({ onClose }: { onClose: () => void }) => {
  const { setUserId } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    
    const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
            credentials: 'include'
          });
    const data = await res.json();
    if (res.ok) {
      setUserId(data.userId);
      onClose();
    } else {
      alert(data.error || 'Error en autenticación');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg space-y-4 text-white w-full max-w-sm">
        <h2 className="text-xl font-bold">{isLogin ? 'Iniciar Sesión' : 'Registro'}</h2>
        <input 
          type="email" placeholder="Email" required
          className="w-full p-2 bg-gray-700 rounded"
          onChange={e => setEmail(e.target.value)}
        />
        <input 
          type="password" placeholder="Contraseña" required
          className="w-full p-2 bg-gray-700 rounded"
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit" className="w-full bg-blue-600 p-2 rounded hover:bg-blue-500">
          {isLogin ? 'Entrar' : 'Registrarse'}
        </button>
        <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-sm underline">
          {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
        </button>
      </form>
    </div>
  );
};
