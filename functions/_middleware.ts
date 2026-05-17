export const onRequest: PagesFunction = async (context) => {
  const { request } = context;
  const url = new URL(request.url);

  // Allow POST requests to /api/auth/login and /api/auth/register to pass through
  if (url.pathname === '/api/auth/login' || url.pathname === '/api/auth/register') {
    if (request.method === 'POST') {
      return await context.next();
    }
  }

  // For all other routes or methods, apply token validation
  const cookieHeader = request.headers.get('Cookie') || '';
  const token = cookieHeader.split('; ').find(row => row.startsWith('auth_token='))?.split('=')[1];

  if (!token) {
    console.log("Middleware: No token found for protected route");
    return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401, headers: { "Content-Type": "application/json" } });
  }

  try {
    const encoder = new TextEncoder();
    const secret = context.env.JWT_SECRET;
    if (!secret) {
        console.error("Middleware: JWT_SECRET not configured");
        return new Response(JSON.stringify({ error: 'Servidor no configurado' }), { status: 500, headers: { "Content-Type": "application/json" } });
    }
    const secretKey = encoder.encode(secret as string);
    
    const { payload } = await jwtVerify(token, secretKey);
    
    // Inyectar el userId en el contexto para uso en las rutas
    context.data.userId = payload.userId;
    
    return await context.next();
  } catch (e: any) {
    console.error("Middleware: Token verification failed", e);
    return new Response(JSON.stringify({ error: 'Token inválido o expirado' }), { status: 401, headers: { "Content-Type": "application/json" } });
  }
};
