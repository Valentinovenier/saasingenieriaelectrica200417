import { jwtVerify } from 'jose';

export const onRequest: PagesFunction = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);
  const jsonHeaders = { "Content-Type": "application/json" };

  console.log(`Middleware: Processing ${request.method} ${url.pathname}`);

  // Permitir acceso a la raíz, endpoints de auth y archivos estáticos (assets)
  if (
    url.pathname === '/' || 
    url.pathname.startsWith('/api/auth/') || 
    url.pathname.startsWith('/assets/') ||
    url.pathname.endsWith('.ico')
  ) {
    return await context.next();
  }

  const cookieHeader = request.headers.get('Cookie') || '';
  const token = cookieHeader.split('; ').find(row => row.startsWith('auth_token='))?.split('=')[1];

  if (!token) {
    console.log("Middleware: No token found");
    return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401, headers: jsonHeaders });
  }

  try {
    const encoder = new TextEncoder();
    const secret = env.JWT_SECRET;
    if (!secret) {
        console.error("Middleware: JWT_SECRET not configured");
        return new Response(JSON.stringify({ error: 'Servidor no configurado' }), { status: 500, headers: jsonHeaders });
    }
    const secretKey = encoder.encode(secret as string);
    
    const { payload } = await jwtVerify(token, secretKey);
    
    // Inyectar el userId en el contexto para uso en las rutas
    context.data.userId = payload.userId;
    
    return await context.next();
  } catch (e) {
    console.error("Middleware: Token verification failed", e);
    return new Response(JSON.stringify({ error: 'Token inválido o expirado' }), { status: 401, headers: jsonHeaders });
  }
};
