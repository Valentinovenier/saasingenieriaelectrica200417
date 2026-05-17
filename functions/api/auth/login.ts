export const onRequest: PagesFunction = async (context) => {
  const { request, env } = context;
  const db = env.DB;

  if (request.method === "POST") {
    const { email, password } = await request.json();

    const user = await db.prepare("SELECT * FROM users WHERE email = ? AND password_hash = ?")
      .bind(email, password)
      .first();

    if (user) {
      return new Response(JSON.stringify({ success: true, userId: user.id }), { status: 200 });
    }

    return new Response(JSON.stringify({ error: "Credenciales inválidas" }), { status: 401 });
  }

  return new Response("Método no soportado", { status: 405 });
};
