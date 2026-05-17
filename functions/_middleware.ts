export const onRequest: PagesFunction = async (context) => {
  const { request } = context;
  const url = new URL(request.url);

  // El middleware solo debe actuar si NO es una ruta de autenticación
  if (url.pathname.startsWith('/api/auth/')) {
    return await context.next();
  }

  // Aquí iría la lógica de validación de token para el resto de la API
  // Pero por ahora, para asegurar que el login funcione, dejamos pasar todo
  // y que cada endpoint maneje su seguridad.
  return await context.next();
};
