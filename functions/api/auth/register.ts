import { hashPassword } from '../utils/crypto';

export const onRequest: PagesFunction = async (context) => {
  const { request, env } = context;
  const db = env.DB;

  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Método no soportado" }), { status: 405 });
  }

  try {
    const { email, password } = await request.json();
    
    if (!email || !password || password.length < 8) {
        return new Response(JSON.stringify({ error: "Datos inválidos" }), { status: 400 });
    }

    const hashedPassword = await hashPassword(password);
    const id = crypto.randomUUID();
      
    await db.prepare("INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)")
      .bind(id, email, hashedPassword)
      .run();

    return new Response(JSON.stringify({ success: true, userId: id }), { 
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: "Error en el servidor: " + e.message }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
};
