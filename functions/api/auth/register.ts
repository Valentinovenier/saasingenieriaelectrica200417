export const onRequest: PagesFunction = async (context) => {
  const { request, env } = context;
  const db = env.DB;

  if (request.method === "POST") {
    const { email, password } = await request.json();
    const id = crypto.randomUUID();
    
    // NOTA: En producción, usa una librería de hashing como argon2 o bcrypt
    // Aquí guardamos la contraseña sin hash solo para demostrar el flujo
    await db.prepare("INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)")
      .bind(id, email, password)
      .run();

    return new Response(JSON.stringify({ success: true, userId: id }), { status: 201 });
  }

  return new Response("Método no soportado", { status: 405 });
};
