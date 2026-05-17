export const onRequest: PagesFunction = async (context) => {
  const { request, env } = context;
  const db = env.DB;

  if (request.method === "POST") {
    try {
      const { email, password } = await request.json();
      const id = crypto.randomUUID();
      
      await db.prepare("INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)")
        .bind(id, email, password)
        .run();

      return new Response(JSON.stringify({ success: true, userId: id }), { 
        status: 201,
        headers: { "Content-Type": "application/json" }
      });
    } catch (e: any) {
      return new Response(JSON.stringify({ error: e.message }), { 
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }
  }

  return new Response(JSON.stringify({ error: "Método no soportado" }), { 
    status: 405,
    headers: { "Content-Type": "application/json" }
  });
};
