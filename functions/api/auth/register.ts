import { hashPassword } from '../utils/crypto';

export const onRequestPost: PagesFunction = async (context) => {
  const { request, env } = context;
  const db = env.DB;
  const jsonHeaders = { "Content-Type": "application/json" };

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
    return new Response(JSON.stringify({ error: "Error en el servidor: " + e.message }), { 
      status: 500,
      headers: jsonHeaders
    });
  }
};
