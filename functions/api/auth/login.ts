export const onRequest: PagesFunction = async (context) => {
  const { env } = context;
  
  try {
    // Prueba simple: intentamos listar las tablas de la base de datos
    const stmt = env.DB.prepare("SELECT name FROM sqlite_master WHERE type='table'");
    const { results } = await stmt.all();
    
    return new Response(JSON.stringify({ 
        message: "Conexión exitosa", 
        tables: results 
    }), { status: 200, headers: { "Content-Type": "application/json" } });
    
  } catch (e: any) {
    return new Response(JSON.stringify({ 
        error: "Fallo en DB", 
        details: e.message 
    }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
};
