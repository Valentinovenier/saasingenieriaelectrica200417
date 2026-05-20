import jwt from 'jsonwebtoken';

export async function onRequestGet(context) {
  const { request, env } = context;
  const authHeader = request.headers.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  let userId;
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.SECRET_KEY || 'fallback_secret_key_for_development') as any;
    userId = decoded.userId;
  } catch (e: any) {
    return new Response(JSON.stringify({ error: `Auth Error: ${e.message}` }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const { results } = await env.DB.prepare('SELECT * FROM projects WHERE userId = ?')
      .bind(userId)
      .all();

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: `Database Error: ${e.message}` }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const authHeader = request.headers.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  let userId;
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.SECRET_KEY || 'fallback_secret_key_for_development') as any;
    userId = decoded.userId;
  } catch (e: any) {
    return new Response(JSON.stringify({ error: `Auth Error: ${e.message}` }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const { id, name, data } = await request.json();

    await env.DB.prepare('INSERT INTO projects (id, userId, name, data) VALUES (?, ?, ?, ?)')
      .bind(id, userId, name, JSON.stringify(data))
      .run();

    return new Response(JSON.stringify({ success: true }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: `Database Error: ${e.message}` }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
