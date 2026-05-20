import jwt from 'jsonwebtoken';

async function verifyAuth(request, env) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Error('Faltan credenciales de autorización');
  }
  
  const token = authHeader.split(' ')[1];
  const SECRET = env.SECRET_KEY || 'fallback_secret_key_for_development';
  try {
    return jwt.verify(token, SECRET) as any;
  } catch (e: any) {
    throw new Error(`Token inválido o expirado: ${e.message}`);
  }
}

export async function onRequestGet(context) {
  const { request, env } = context;
  try {
    const user = await verifyAuth(request, env);
    const { results } = await env.DB.prepare('SELECT * FROM projects WHERE user_id = ?')
      .bind(user.userId)
      .all();
    return new Response(JSON.stringify(results), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (e: any) {
    const status = e.message.includes('autorización') || e.message.includes('Token') ? 401 : 500;
    return new Response(JSON.stringify({ error: e.message }), { status, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const user = await verifyAuth(request, env);
    const { id, name, data } = await request.json();

    const userExists = await env.DB.prepare('SELECT id FROM users WHERE id = ?')
      .bind(user.userId)
      .first();

    if (!userExists) {
      return new Response(JSON.stringify({ error: `El usuario con ID ${user.userId} no existe en la base de datos.` }), { 
        status: 400, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    await env.DB.prepare('INSERT INTO projects (id, user_id, name, data) VALUES (?, ?, ?, ?)')
      .bind(id, user.userId, name, JSON.stringify(data))
      .run();

    return new Response(JSON.stringify({ success: true }), { 
      status: 201, 
      headers: { 'Content-Type': 'application/json' } 
    });
  } catch (e: any) {
    const status = e.message.includes('autorización') || e.message.includes('Token') ? 401 : 500;
    return new Response(JSON.stringify({ error: `Error en Servidor: ${e.message}` }), { 
      status, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }
}
