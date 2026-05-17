import { Hono } from 'hono';
import { cors } from 'hono/cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

interface Env {
  SECRET_KEY: string;
  DB: D1Database;
}

interface User {
  id: string;
  username: string;
  passwordHash: string;
}

const app = new Hono<Env>();

app.use('/*', cors());

// Register endpoint
app.post('/api/register', async (c) => {
  const { username, password } = await c.req.json();

  if (!username || !password) {
    return c.json({ error: 'Username and password are required' }, 400);
  }

  try {
    const existingUser = await c.env.DB.prepare('SELECT id FROM users WHERE username = ?')
      .bind(username)
      .first();

    if (existingUser) {
      return c.json({ error: 'User already exists' }, 409);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userId = Date.now().toString();

    await c.env.DB.prepare('INSERT INTO users (id, username, password_hash) VALUES (?, ?, ?)')
      .bind(userId, username, passwordHash)
      .run();

    return c.json({ message: 'User registered successfully' }, 201);
  } catch (e: any) {
    return c.json({ error: 'Database error: ' + e.message }, 500);
  }
});

// Login endpoint
app.post('/api/login', async (c) => {
  const { username, password } = await c.req.json();

  if (!username || !password) {
    return c.json({ error: 'Username and password are required' }, 400);
  }

  try {
    const user = await c.env.DB.prepare('SELECT * FROM users WHERE username = ?')
      .bind(username)
      .first();

    if (!user) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return c.json({ error: 'Invalid credentials' }, 401);
    }

    const token = jwt.sign({ userId: user.id, username: user.username }, c.env.SECRET_KEY, { expiresIn: '1h' });

    return c.json({ token });
  } catch (e: any) {
    return c.json({ error: 'Database error: ' + e.message }, 500);
  }
});

// Authentication middleware (example of a protected route)
app.get('/api/protected', async (c) => {
  const authHeader = c.req.header('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, c.env.SECRET_KEY);
    return c.json({ message: 'Welcome to the protected route!', user: decoded });
  } catch (error) {
    return c.json({ error: 'Invalid token' }, 401);
  }
});

export default app;
