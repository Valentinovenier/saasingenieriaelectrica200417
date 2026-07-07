export async function onRequestGet(context) {
  const { env } = context;
  try {
    const { results } = await env.DB.prepare('SELECT * FROM protecciones').all();
    return new Response(JSON.stringify(results), { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' } 
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }
}

export async function onRequestPost(context) {
  const { request, env } = context;
  try {
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
      headers: { 'Content-Type': 'application/json' } 
    });
  } catch (e: any) {
    await env.DB.prepare('ROLLBACK').run();
    return new Response(JSON.stringify({ error: 'Error al crear la protección', details: e.message }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }
}
