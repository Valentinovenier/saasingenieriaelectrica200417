export const onRequest: PagesFunction = async (context) => {
  const { request, env } = context;
  const db = env.DB;

  try {
    // GET: Listar proyectos del usuario
    if (request.method === "GET") {
      const url = new URL(request.url);
      const user_id = url.searchParams.get("user_id");
      
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
      const { id, user_id, name, data } = body;

      await db.prepare("INSERT INTO projects (id, user_id, name, data) VALUES (?, ?, ?, ?)")
        .bind(id, user_id, name, JSON.stringify(data))
        .run();

      return new Response(JSON.stringify({ success: true }), { status: 201 });
    }
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }

  return new Response("Método no soportado", { status: 405 });
};
