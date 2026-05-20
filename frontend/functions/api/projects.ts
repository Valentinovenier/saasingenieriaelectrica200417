import jwt from 'jsonwebtoken';

export async function onRequestGet(context) {
  const { request, env } = context;
  const authHeader = request.headers.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.SECRET_KEY);
    const userId = decoded.userId;

    const { results } = await env.DB.prepare('SELECT * FROM projects WHERE userId = ?')
      .bind(userId)
      .all();

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Invalid token' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const authHeader = request.headers.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, env.SECRET_KEY);
    const userId = decoded.userId;

    const { id, name, data } = await request.json();

    await env.DB.prepare('INSERT INTO projects (id, userId, name, data) VALUES (?, ?, ?, ?)')
      .bind(id, userId, name, JSON.stringify(data))
      .run();

    return new Response(JSON.stringify({ success: true }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Internal Server Error: ' + e.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
