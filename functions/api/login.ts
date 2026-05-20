import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const { username, password } = await request.json();
    const SECRET = env.SECRET_KEY || 'fallback_secret_key_for_development';

    if (!username || !password) {
      return new Response(JSON.stringify({ error: 'Faltan credenciales' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const user = await env.DB.prepare('SELECT * FROM users WHERE username = ?')
      .bind(username)
      .first();

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return new Response(JSON.stringify({ error: 'Usuario o contraseña incorrectos' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const token = jwt.sign({ userId: user.id, username: user.username }, SECRET, { expiresIn: '24h' });

    return new Response(JSON.stringify({ token }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: 'Error crítico en login: ' + e.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
