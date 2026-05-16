import { Hono } from 'hono';
import engine from './engine';

// Definir los bindings para Cloudflare
type Bindings = {
  DB: D1Database;
  PLANOS_BUCKET: R2Bucket;
};

const app = new Hono<{ Bindings: Bindings }>();

// Montar el motor de cálculo
app.route('/api', engine);

// Endpoint para subir un plano
app.post('/api/upload-plano', async (c) => {
  const body = await c.req.parseBody();
  const file = body['file'] as File;

  if (!file) {
    return c.json({ error: 'Archivo no proporcionado' }, 400);
  }

  // Guardar en R2
  const fileName = `${Date.now()}-${file.name}`;
  await c.env.PLANOS_BUCKET.put(fileName, file.stream());

  // Registrar en D1 (Base de datos)
  await c.env.DB.prepare(
    'INSERT INTO planos (id, nombre, status) VALUES (?, ?, ?)'
  ).bind(fileName, file.name, 'PENDING').run();

  return c.json({ success: true, id: fileName });
});

// Endpoint para consultar estado del cálculo
app.get('/api/status/:id', async (c) => {
  const id = c.req.param('id');
  const result = await c.env.DB.prepare(
    'SELECT status FROM planos WHERE id = ?'
  ).bind(id).first();

  if (!result) return c.json({ error: 'No encontrado' }, 404);
  return c.json(result);
});

export default app;
