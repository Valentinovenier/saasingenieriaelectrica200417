import { verifyPassword } from '../utils/crypto';
import { signToken } from '../utils/jwt';

export const onRequest: PagesFunction = async (context) => {
  const { request, env } = context;
  const db = env.DB;
  const SECRET = env.JWT_SECRET as string;
  const jsonHeaders = { "Content-Type": "application/json" };

  // Check if the method is POST, otherwise return 405
  if (request.method !== "POST") {
    return new Response(JSON.stringify({ error: "Método no soportado" }), { status: 405, headers: jsonHeaders });
  }

  try {
    const { email, password } = await request.json();

    const user = await db.prepare("SELECT id, password_hash FROM users WHERE email = ?")
      .bind(email)
      .first();

    if (!user || !(await verifyPassword(password, user.password_hash as string))) {
        return new Response(JSON.stringify({ error: "Credenciales inválidas" }), { status: 401, headers: jsonHeaders });
    }

    const token = await signToken(user.id as string, SECRET);

    // Return token directly in JSON response
    return new Response(JSON.stringify({ success: true, token }), { 
      status: 200,
      headers: jsonHeaders
    });
  } catch (e: any) {
    // Log the error for debugging purposes before sending a generic response
    console.error("Error in /api/auth/login:", e);
    return new Response(JSON.stringify({ error: "Error de servidor" }), { status: 500, headers: jsonHeaders });
  }
};
