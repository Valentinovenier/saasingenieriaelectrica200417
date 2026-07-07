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

    // Preparamos las sentencias para batch
    const statements = [];

    // 1. Insertar la protección
    statements.push(
      env.DB.prepare(
        'INSERT INTO protecciones (marca_id, modelo, tipo_proteccion, in_amp, curva_disparo, polos, specs_tecnicas) VALUES (?, ?, ?, ?, ?, ?, ?)'
      )
      .bind(marca_id || 1, modelo, tipo_proteccion, in_amp, curva_disparo, polos, JSON.stringify(specs_tecnicas || {}))
    );

    // 2. Insertar capacidades (necesitamos el ID generado)
    // D1 batch no permite usar last_insert_rowid() directamente en el mismo batch secuencialmente, 
    // pero podemos hacer la inserción de la protección primero para obtener el ID.
    const proteccionResult = await env.DB.prepare(
      'INSERT INTO protecciones (marca_id, modelo, tipo_proteccion, in_amp, curva_disparo, polos, specs_tecnicas) VALUES (?, ?, ?, ?, ?, ?, ?)'
    )
    .bind(marca_id || 1, modelo, tipo_proteccion, in_amp, curva_disparo, polos, JSON.stringify(specs_tecnicas || {}))
    .run();

    const proteccion_id = proteccionResult.meta.last_row_id;

    // 3. Insertar capacidades en batch
    if (capacidades && Array.isArray(capacidades) && capacidades.length > 0) {
      const capStatements = capacidades.map(cap => 
        env.DB.prepare(
          'INSERT INTO capacidades_corte (proteccion_id, tension_v, icn_ka, icu_ka, ics_ka) VALUES (?, ?, ?, ?, ?)'
        )
        .bind(proteccion_id, cap.tension_v, cap.icn_ka, cap.icu_ka, cap.ics_ka)
      );
      await env.DB.batch(capStatements);
    }

    return new Response(JSON.stringify({ success: true, proteccion_id }), { 
      status: 201, 
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } 
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: 'Error al crear la protección', details: e.message, stack: e.stack }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } 
    });
  }
}

export async function onRequestPut(context) {
  const { request, env } = context;
  try {
    await verifyAuth(request, env);
    const body = await request.json() as any;
    const { id, marca_id, modelo, tipo_proteccion, in_amp, curva_disparo, polos, specs_tecnicas, capacidades } = body;

    // 1. Actualizar la protección
    await env.DB.prepare(
      'UPDATE protecciones SET marca_id = ?, modelo = ?, tipo_proteccion = ?, in_amp = ?, curva_disparo = ?, polos = ?, specs_tecnicas = ? WHERE id = ?'
    )
    .bind(marca_id, modelo, tipo_proteccion, in_amp, curva_disparo, polos, JSON.stringify(specs_tecnicas || {}), id)
    .run();

    // 2. Eliminar capacidades antiguas y insertar las nuevas (Batch)
    const statements = [];
    statements.push(env.DB.prepare('DELETE FROM capacidades_corte WHERE proteccion_id = ?').bind(id));
    
    if (capacidades && Array.isArray(capacidades)) {
      capacidades.forEach(cap => {
        statements.push(
          env.DB.prepare(
            'INSERT INTO capacidades_corte (proteccion_id, tension_v, icn_ka, icu_ka, ics_ka) VALUES (?, ?, ?, ?, ?)'
          )
          .bind(id, cap.tension_v, cap.icn_ka, cap.icu_ka, cap.ics_ka)
        );
      });
    }
    
    await env.DB.batch(statements);

    return new Response(JSON.stringify({ success: true }), { 
      status: 200, 
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } 
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: 'Error al actualizar la protección', details: e.message, stack: e.stack }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } 
    });
  }
}

