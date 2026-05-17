# Configuración Final del Backend

Para que el sistema de usuarios y la persistencia de proyectos funcionen en Cloudflare, debes realizar los siguientes pasos finales en el Dashboard de Cloudflare:

## 1. Crear las Tablas en D1
Accede a tu base de datos D1 en el panel de Cloudflare, abre la consola SQL y ejecuta:

```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL
);

CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  name TEXT NOT NULL,
  data TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## 2. Vincular la Base de Datos
1. Ve a tu proyecto de **Cloudflare Pages**.
2. Entra en **Settings** > **Functions**.
3. En la sección **D1 database bindings**, añade un nuevo binding:
   - **Variable name:** `DB`
   - **Database:** Selecciona tu base de datos D1.

## 3. Despliegue
Simplemente sube tus cambios a tu repositorio vinculado con Cloudflare Pages y el despliegue se realizará automáticamente.
