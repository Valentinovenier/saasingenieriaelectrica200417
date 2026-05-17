import { useState } from 'react';

export const Auth = ({ onAuth }: { onAuth: () => void }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Por favor, ingresa un correo electrónico válido.');
      return;
    }

    if (!isLogin && password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Error en la solicitud');
      }
      
      if (!isLogin) {
        alert('Registro exitoso. Ahora puedes iniciar sesión.');
        setIsLogin(true);
        setPassword('');
      } else {
        onAuth();
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-[var(--bg-primary)]">
      <form onSubmit={handleSubmit} className="bg-[var(--bg-secondary)] p-8 rounded-2xl w-full max-w-sm border border-slate-700">
        <h2 className="text-2xl font-bold text-white mb-6">{isLogin ? 'Iniciar Sesión' : 'Registro'}</h2>
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-3 rounded-xl mb-4 text-sm font-medium">
            {error}
          </div>
        )}
        <input 
          className="w-full bg-[var(--bg-primary)] border border-slate-700 rounded-xl px-4 py-3 text-white mb-4"
          placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
        />
        <input 
          type="password"
          className="w-full bg-[var(--bg-primary)] border border-slate-700 rounded-xl px-4 py-3 text-white mb-6"
          placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)}
        />
        <button className="w-full bg-[var(--accent)] text-black font-bold py-3 rounded-xl mb-4">
          {isLogin ? 'Entrar' : 'Registrarse'}
        </button>
        <p className="text-center text-slate-400 cursor-pointer" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? '¿No tenés cuenta? Registrate' : '¿Ya tenés cuenta? Inicia sesión'}
        </p>
      </form>
    </div>
  );
};
