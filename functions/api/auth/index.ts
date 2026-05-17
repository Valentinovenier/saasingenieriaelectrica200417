import { verifyPassword, hashPassword } from '../utils/crypto';
import { signToken } from '../utils/jwt';

export const onRequestPost: PagesFunction = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const db = env.DB;
  const SECRET = env.JWT_SECRET as string;
  const jsonHeaders = { "Content-Type": "application/json" };

  try {
    // Manejar Login
    if (url.pathname === "/api/auth/login") {
      const { email, password } = await request.json();
      const user = await db.prepare("SELECT id, password_hash FROM users WHERE email = ?")
        .bind(email)
        .first();

      if (!user || !(await verifyPassword(password, user.password_hash as string))) {
        return new Response(JSON.stringify({ error: "Credenciales inválidas" }), { status: 401, headers: jsonHeaders });
      }

      const token = await signToken(user.id as string, SECRET);
      return new Response(JSON.stringify({ success: true, token }), { status: 200, headers: jsonHeaders });
    }

    // Manejar Registro
    if (url.pathname === "/api/auth/register") {
      const { email, password } = await request.json();
      if (!email || !password || password.length < 8) {
        return new Response(JSON.stringify({ error: "Datos inválidos" }), { status: 400, headers: jsonHeaders });
      }

      const hashedPassword = await hashPassword(password);
      const id = crypto.randomUUID();
      await db.prepare("INSERT INTO users (id, email, password_hash) VALUES (?, ?, ?)")
        .bind(id, email, hashedPassword)
        .run();

      return new Response(JSON.stringify({ success: true, userId: id }), { status: 201, headers: jsonHeaders });
    }
  } catch (e: any) {
    return new Response(JSON.stringify({ error: "Error de servidor: " + e.message }), { status: 500, headers: jsonHeaders });
  }

  return new Response(JSON.stringify({ error: "No encontrado" }), { status: 404, headers: jsonHeaders });
};
