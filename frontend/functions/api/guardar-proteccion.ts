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

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function onRequestGet(context) {
  const { request, env } = context;
  try {
    await verifyAuth(request, env);
    const { results } = await env.DB.prepare('SELECT * FROM protecciones').all();
    return new Response(JSON.stringify(results), { 
      status: 200, 
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } 
    });
  } catch (e: any) {
    const status = e.message.includes('autorización') || e.message.includes('Token') ? 401 : 500;
    return new Response(JSON.stringify({ error: e.message, stack: e.stack }), { 
      status, 
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } 
    });
  }
}

export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    await verifyAuth(request, env);
    const body = await request.json() as any;
    const { marca_id, modelo, tipo_proteccion, in_amp, curva_disparo, polos, specs_tecnicas, capacidades } = body;

    await env.DB.prepare('BEGIN TRANSACTION').run();
    
    await env.DB.prepare(
      'INSERT INTO protecciones (marca_id, modelo, tipo_proteccion, in_amp, curva_disparo, polos, specs_tecnicas) VALUES (?, ?, ?, ?, ?, ?, ?)'
    )
    .bind(marca_id || 1, modelo, tipo_proteccion, in_amp, curva_disparo, polos, JSON.stringify(specs_tecnicas || {}))
    .run();
    
    const idResult = await env.DB.prepare('SELECT last_insert_rowid() as id').first();
    const proteccion_id = (idResult as any).id;

    if (capacidades && Array.isArray(capacidades)) {
      for (const cap of capacidades) {
        await env.DB.prepare(
          'INSERT INTO capacidades_corte (proteccion_id, tension_v, icn_ka, icu_ka, ics_ka) VALUES (?, ?, ?, ?, ?)'
        )
        .bind(proteccion_id, cap.tension_v, cap.icn_ka, cap.icu_ka, cap.ics_ka)
        .run();
      }
    }

    await env.DB.prepare('COMMIT').run();
    return new Response(JSON.stringify({ success: true, proteccion_id }), { 
      status: 201, 
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } 
    });
  } catch (e: any) {
    try { await env.DB.prepare('ROLLBACK').run(); } catch(rbErr) {}

    const status = e.message.includes('autorización') || e.message.includes('Token') ? 401 : 500;
    return new Response(JSON.stringify({ error: 'Error al crear la protección', details: e.message, stack: e.stack }), { 
      status, 
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } 
    });
  }
}
