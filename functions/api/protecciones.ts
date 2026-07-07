import { D1Database } from '@cloudflare/workers-types';

interface Env {
  DB: D1Database;
}

export const onRequest: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  const method = request.method;

  // Log para depuración
  console.log(`API call: ${method} ${request.url}`);

  // GET: Listar protecciones
  if (method === 'GET') {
    const { results } = await env.DB.prepare(
      'SELECT * FROM protecciones'
    ).all();
    return Response.json(results);
  }

  // POST: Crear una nueva protección con sus capacidades
  if (method === 'POST') {
    try {
      const body = await request.json() as any;
      const { marca_id, modelo, tipo_proteccion, in_amp, curva_disparo, polos, specs_tecnicas, capacidades } = body;

      // Usar transacción para asegurar la integridad
      await env.DB.prepare('BEGIN TRANSACTION').run();
      
      await env.DB.prepare(
        'INSERT INTO protecciones (marca_id, modelo, tipo_proteccion, in_amp, curva_disparo, polos, specs_tecnicas) VALUES (?, ?, ?, ?, ?, ?, ?)'
      )
      .bind(marca_id || 1, modelo, tipo_proteccion, in_amp, curva_disparo, polos, JSON.stringify(specs_tecnicas || {}))
      .run();
      
      // Obtener el ID insertado
      const idResult = await env.DB.prepare('SELECT last_insert_rowid() as id').first();
      const proteccion_id = (idResult as any).id;

      // Insertar capacidades
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
      return Response.json({ success: true, proteccion_id }, { status: 201 });
    } catch (e: any) {
      await env.DB.prepare('ROLLBACK').run();
      return Response.json({ error: 'Error al crear la protección', details: e.message }, { status: 500 });
    }
  }

  return Response.json({ error: 'Method not allowed' }, { status: 405 });
};
