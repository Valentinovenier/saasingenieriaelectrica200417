export const onRequest: PagesFunction = async (context) => {
  const { request, env } = context;
  const db = env.DB;

  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Método no soportado" }), { status: 405, headers: { "Content-Type": "application/json" } });
  }

  try {
    const { email, password } = await request.json();

    const user = await db.prepare("SELECT * FROM users WHERE email = ? AND password_hash = ?")
      .bind(email, password)
      .first();

    if (user) {
      return new Response(JSON.stringify({ success: true, userId: user.id }), { status: 200, headers: { "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ error: "Credenciales inválidas" }), { status: 401, headers: { "Content-Type": "application/json" } });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: "Error en el servidor: " + e.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
};
