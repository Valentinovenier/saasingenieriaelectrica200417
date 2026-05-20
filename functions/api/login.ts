import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return new Response(JSON.stringify({ error: 'Username and password are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const user = await env.DB.prepare('SELECT * FROM users WHERE username = ?')
      .bind(username)
      .first();

    if (!user) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username }, 
      env.SECRET_KEY || 'fallback_secret_key_for_development', 
      { expiresIn: '24h' }
    );

    return new Response(JSON.stringify({ token }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Error interno al generar sesión: ' + e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
