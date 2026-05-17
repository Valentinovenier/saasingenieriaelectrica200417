import { jwtVerify } from 'jose';

export const onRequest: PagesFunction = async (context) => {
  const { request, env } = context;
  const url = new URL(request.url);

  // Permitir el registro y login sin autenticación
  if (url.pathname.startsWith('/api/auth/')) {
    return await context.next();
  }

  const cookieHeader = request.headers.get('Cookie') || '';
  const token = cookieHeader.split('; ').find(row => row.startsWith('auth_token='))?.split('=')[1];

  if (!token) {
    return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401 });
  }

  try {
    const encoder = new TextEncoder();
    const secretKey = encoder.encode(env.JWT_SECRET as string);
    
    const { payload } = await jwtVerify(token, secretKey);
    
    // Inyectar el userId en el contexto para uso en las rutas
    context.data.userId = payload.userId;
    
    return await context.next();
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Token inválido o expirado' }), { status: 401 });
  }
};
