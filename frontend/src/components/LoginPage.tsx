import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
  const { setUserId } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Enviando petición a:", isLogin ? '/api/auth/login' : '/api/auth/register');
    
    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'Error desconocido' }));
        console.error("Error del servidor:", errorData);
        alert(errorData.error || 'Error en autenticación');
        return;
      }

      const data = await res.json();
      console.log("Respuesta del servidor:", data);
      setUserId(data.userId);
    } catch (error) {
      console.error("Error al conectar con la API:", error);
      alert("Error de conexión con el servidor");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg shadow-xl space-y-6 text-white w-full max-w-md">
        <h1 className="text-2xl font-bold text-center">Gestor Eléctrico</h1>
        <h2 className="text-lg text-center">{isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}</h2>
        <input 
          type="email" placeholder="Email" required
          className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
          onChange={e => setEmail(e.target.value)}
        />
        <input 
          type="password" placeholder="Contraseña" required
          className="w-full p-3 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-blue-500"
          onChange={e => setPassword(e.target.value)}
        />
        <button type="submit" className="w-full bg-blue-600 p-3 rounded font-bold hover:bg-blue-500 transition">
          {isLogin ? 'Entrar' : 'Registrarse'}
        </button>
        <button type="button" onClick={() => setIsLogin(!isLogin)} className="w-full text-sm text-gray-400 hover:text-white underline">
          {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
        </button>
      </form>
    </div>
  );
};
