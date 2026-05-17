import { hashPassword } from '../utils/crypto';

export const onRequest: PagesFunction = async (context) => {
  const { request, env } = context;
  const db = env.DB;
  const jsonHeaders = { "Content-Type": "application/json" };

  // Check if the method is POST, otherwise return 405
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Método no soportado" }), { status: 405, headers: jsonHeaders });
  }

  try {
    const { email, password } = await request.json();
    
    if (!email || !password || password.length < 8) {
        return new Response(JSON.stringify({ error: "Datos inválidos (la contraseña debe tener al menos 8 caracteres)" }), { status: 400, headers: jsonHeaders });
    }

    const hashedPassword = await hashPassword(password);
    const id = crypto.randomUUID();
      
    await db.prepare("INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)")
      .bind(id, email, hashedPassword)
      .run();

    return new Response(JSON.stringify({ success: true, userId: id }), { 
      status: 201,
      headers: jsonHeaders
    });
  } catch (e: any) {
    // Log the error for debugging purposes before sending a generic response
    console.error("Error in /api/auth/register:", e);
    return new Response(JSON.stringify({ error: "Error de servidor" }), { 
      status: 500,
      headers: jsonHeaders
    });
  }
};
