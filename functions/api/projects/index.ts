import { jwtVerify } from '../utils/jwt';

export const onRequest: PagesFunction = async (context) => {
  const { request, env } = context;
  const db = env.DB;
  const authHeader = request.headers.get("Authorization") || "";
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return new Response(JSON.stringify({ error: "No autorizado" }), { 
      status: 401,
      headers: { "Content-Type": "application/json" }
    });
  }

  try {
    const encoder = new TextEncoder();
    const { payload } = await jwtVerify(token, encoder.encode(env.JWT_SECRET as string));
    const user_id = payload.userId as string;

    // GET: Listar proyectos del usuario
    if (request.method === "GET") {
      const { results } = await db.prepare("SELECT * FROM projects WHERE user_id = ?")
        .bind(user_id)
        .all();
        
      return new Response(JSON.stringify(results), {
        headers: { "Content-Type": "application/json" },
      });
    }

    // POST: Crear proyecto
    if (request.method === "POST") {
      const body = await request.json();
      const { id, name, data } = body;

      await db.prepare("INSERT INTO projects (id, user_id, name, data) VALUES (?, ?, ?, ?)")
        .bind(id, user_id, name, JSON.stringify(data))
        .run();

      return new Response(JSON.stringify({ success: true }), { 
        status: 201,
        headers: { "Content-Type": "application/json" }
      });
    }
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }

  return new Response(JSON.stringify({ error: "Método no soportado" }), { 
    status: 405,
    headers: { "Content-Type": "application/json" }
  });
};
