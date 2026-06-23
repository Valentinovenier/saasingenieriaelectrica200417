# Contexto del Proyecto: SaaS de Ingeniería Eléctrica (Cálculo de Conductores y Unifilares)

Este documento sirve como referencia de contexto para futuras sesiones de chat y asistentes de IA. Contiene toda la información técnica, lógica de negocios, arquitectura y modelos de datos del proyecto para garantizar una continuidad sin fricciones en el desarrollo.

---

## 1. Descripción General del Proyecto
Es una aplicación **SaaS (Software as a Service) de Ingeniería Eléctrica** que permite a ingenieros y diseñadores eléctricos:
1. **Diseñar esquemas unifilares**: Configurar subestaciones transformadoras, el Tablero General de Baja Tensión (TGBT) y Tableros Seccionales de forma jerárquica.
2. **Dimensionar conductores (cables) de forma automatizada**: Calcular la sección transversal óptima de cables de cobre o aluminio con aislamiento de PVC, XLPE o Mineral.
3. **Aplicar correcciones normativas (AEA / IRAM / IEC)**: Corregir la capacidad de corriente de los cables según métodos de instalación, factores de temperatura ambiente, agrupamiento de circuitos y simetría de conductores en paralelo.
4. **Calcular parámetros eléctricos**: Corrientes nominales de transformadores ($I_{ntr}$), corrientes de cortocircuito ($I_{k1}$) y caídas de tensión en los tramos.
5. **Seleccionar protecciones**: Elegir automáticamente interruptores de caja moldeada o abiertos (ACB) de marcas líderes (ABB, Schneider) cumpliendo con criterios de poder de corte, solicitación térmica y poder de cierre.
6. **Persistencia Multiusuario**: Creación, guardado y eliminación de proyectos por usuario con almacenamiento en la nube de Cloudflare.

---

## 2. Stack Tecnológico
### Frontend
- **Framework**: React 18 (TypeScript) con Vite.
- **Estilos**: TailwindCSS para una interfaz moderna, responsive y con soporte para paletas oscuras/claras.
- **Iconografía**: `lucide-react` para iconos de la interfaz.
- **Procesamiento de Archivos**: `xlsx` (SheetJS) para el mapeo e importación de listas de cargas desde planillas Excel.
- **Autenticación en Cliente**: Contexto de autenticación en React (`AuthContext.tsx`) con persistencia en `localStorage` mediante tokens JWT.

### Backend (Cloudflare Pages Functions)
- **Tecnología**: Cloudflare Pages con Functions (carpeta `/functions/api/` y `/frontend/functions/api/`).
- **Base de Datos**: Cloudflare D1 (Base de datos SQL distribuida de SQLite en el edge).
- **Almacenamiento (Bucket)**: Cloudflare R2 (para almacenamiento de catálogos y recursos).
- **Autenticación**: Firmado y validación de tokens JWT con `jsonwebtoken` y `jose`.
- **Configuración de Despliegue**: Wrangler (`wrangler.toml`), con bindings para base de datos (`DB`), bucket (`BUCKET`) y namespaces de KV.

---

## 3. Estructura del Código Fuente
El código está estructurado de manera modular y limpia:

```
├───backend\                # Documentación del backend
├───Catalogos\              # PDFs de apoyo técnico (ABB, Schneider, normas AEA)
├───functions\              # Backend de Cloudflare Pages (API de Login, Register y Projects)
│   ├───schema.sql          # Esquema de la base de datos D1
│   └───api\
│       ├───login.ts        # Endpoint de autenticación e inicio de sesión
│       ├───projects.ts     # CRUD de proyectos por usuario
│       └───register.ts     # Registro de nuevos usuarios
└───frontend\
    ├───index.html
    ├───tsconfig.json
    ├───functions\api\...   # Duplicado/vínculo del backend para entorno local Pages
    └───src\
        ├───App.tsx         # Punto de entrada de la UI y ruteo entre Login/Dashboard/Páginas
        ├───index.css
        ├───main.tsx
        ├───assets\symbols\ # Recursos vectoriales de simbología eléctrica (.svg)
        ├───components\     # Componentes de React
        │   ├───ConductorCalculation.tsx  # Vista para el cálculo del conductor de un tramo
        │   ├───ConductorForm.tsx         # Formulario de parámetros para cálculo de cables
        │   ├───ExcelMapper.tsx           # Asistente para mapear y subir un Excel de cargas
        │   ├───LiveUnifilar.tsx          # Dibujo SVG en vivo del esquema unifilar básico
        │   ├───LoginPage.tsx / RegisterPage.tsx # Interfaces de autenticación
        │   ├───ProjectSettings.tsx       # Configuración general y criterios de cálculo del proyecto
        │   ├───UnifilarEditor.tsx        # Editor interactivo del TGBT y protecciones
        │   ├───UnifilarCanvas.tsx        # Canvas interactivo para el esquema unifilar completo
        │   └───symbols\                  # Componentes React de símbolos eléctricos (IEC)
        ├───context\
        │   ├───AuthContext.tsx           # Contexto global para sesión de usuario
        │   └───ProjectDataContext.tsx    # Contexto global del proyecto actualmente activo
        ├───data\           # Tablas de datos y catálogos estáticos
        │   ├───cables.ts                 # Impedancias, resistencias y reactancias de PVC y XLPE
        │   ├───corrientesNormativasAdmisibles.ts  # Corrientes admisibles según método de instalación
        │   ├───factoresAgrupamiento.ts   # Factores de agrupamiento de circuitos en el mismo conducto
        │   ├───factoresSimetria.ts       # Factores por conductores en paralelo
        │   ├───factoresTemperatura.ts    # Factores por temperatura en aire y en tierra
        │   ├───interruptoresAutomaticosAbiertos(ABB/Schneider).ts # Catálogos de interruptores
        │   └───transformadores(Aceite/Secos).ts  # Catálogos de transformadores
        ├───engine\         # MOTOR DE CÁLCULO ELÉCTRICO (Core de Ingeniería)
        │   ├───calculadorTramo.ts        # Algoritmo principal para dimensionar conductores
        │   ├───corrienteProvider.ts      # Proveedor de corrientes admisibles de cables
        │   ├───cortocircuito.ts          # Lógica para cálculo de corrientes de cortocircuito
        │   ├───impedancia.ts             # Suma y cálculo de impedancias de cables y trafos
        │   ├───seleccionProtecciones.ts  # Selección automatizada de interruptores de potencia
        │   └───transformador.ts          # Cálculos de resistencia y reactancia de transformadores
        └───types\          # Tipados e interfaces de TypeScript del sistema
```

---

## 4. Base de Datos (Cloudflare D1)
El esquema de persistencia utiliza dos tablas principales (`schema.sql`):

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
  data TEXT NOT NULL, -- Objeto JSON stringificado con la estructura completa del proyecto
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

---

## 5. Modelos de Datos Clave (TypeScript)

Los tipos de datos se encuentran en `frontend/src/types/project.ts` y modelan una red eléctrica simplificada:

### Proyecto (`Project`)
```typescript
export interface Project {
  id: string;
  name: string;
  createdAt: string;
  status: 'draft' | 'completed';
  transformador?: Transformador;
  armonicos: HarmonicDistortion;
  tableros: TableroSeccional[];
  conductorTGBTBarra?: Conductor;
  conductores?: Record<string, Conductor>;
  tempAmbiente?: number;
  coefSimultaneidad?: number;
  tipoInstalacion?: 'Monofásica' | 'Trifásica';
}
```

### Conductor/Cable (`Conductor`)
Representa las características técnicas elegidas y calculadas para un tramo de cable.
```typescript
export interface Conductor {
  tipo: 'Cable' | 'CEP';
  material?: 'Cobre' | 'Aluminio';
  aislacion?: 'PVC' | 'XLPE' | 'Mineral';
  seccion?: number;              // mm²
  longitud?: number;             // m
  metodoInstalacion?: string;    // Método de instalación (A1, A2, B1, B2, C, D1, D2, E, F, G)
  agrupamiento?: number;         // Número de circuitos agrupados
  tipoCable?: 'Multipolar' | 'Unipolar';
  disposicion?: 'trebol' | 'contacto' | 'separado'; // Para unipolares
  plano?: 'horizontal' | 'vertical';               // Para método G
  caidaMaxPermitida?: number;    // % admisible
  tiempoAperturaMT?: number;     // Segundos para soportabilidad térmica ante cortocircuito
}
```

### Protección (`Proteccion`)
```typescript
export interface Proteccion {
  tipo: 'Termomagnética' | 'Fusible' | 'Interruptor Automático Abierto' | 'Interruptor Automático Compacto' | 'PIA';
  valorNominal: number;          // Amperios (In)
  curva?: string;                // Ej. B, C, D
  marca?: 'Schneider' | 'ABB';
}
```

### Tablero Seccional (`TableroSeccional`)
Representa los nodos de distribución aguas abajo de la instalación. Es una estructura jerárquica/recursiva.
```typescript
export interface TableroSeccional {
  id: string;
  name: string;
  tipo: 'Fuerza Motriz' | 'Iluminación';
  potenciaTotal: number;
  subTableros: TableroSeccional[];
  proteccionCabecera?: Proteccion;
  proteccionesSalida: Proteccion[];
}
```

---

## 6. Lógica y Motor de Cálculos (`engine`)

El corazón técnico de la aplicación realiza cálculos rigurosos de ingeniería eléctrica bajo estándares normativos:

### A) Dimensionamiento de Conductores (`calculadorTramo.ts`)
Busca la sección mínima de cable que cumpla de forma simultánea con tres condiciones de diseño:
1. **Capacidad de Conducción de Corriente ($I_{admisible}$)**:
   - Se obtiene la corriente base de las tablas de corrientes admisibles normativas (`corrientesNormativasAdmisibles.ts`) para la sección, material, aislamiento y método de instalación seleccionado.
   - **Corrección Térmica ($f_{temp}$)**: Aplica factores de corrección por temperatura ambiente en el aire o en tierra según el aislamiento (PVC, XLPE, Mineral).
   - **Corrección por Agrupamiento ($f_{agrup}$)**: Aplica reducción si hay múltiples circuitos en paralelo en el mismo conducto (tablas de factores de agrupamiento según si es método D1, D2, E, F, G, etc.).
   - **Corrección por Simetría ($f_{simetria}$)**: En caso de utilizar conductores en paralelo por fase ($n > 1$), aplica factores de reducción si hay desequilibrios (normalmente $0.8$ para $n > 1$).
   - **Cálculo final**: 
     $$I_{admisible\_corregida} = I_{admisible\_base} \times n \times f_{temp} \times f_{agrup} \times f_{simetria}$$
     Debe cumplirse que: $$I_{admisible\_corregida} \geq I_{diseño}$$

2. **Caída de Tensión Admisible ($\Delta V$)**:
   - Calcula la impedancia de cada conductor ($R$ y $X$ según sección y catálogo).
   - Calcula la caída de tensión porcentual aproximada con la fórmula:
     - **Trifásica**:
       $$\Delta V = \frac{\sqrt{3} \cdot I_{diseño} \cdot L \cdot (R \cdot \cos\phi + X \cdot \sin\phi)}{V_{nominal}} \times 100$$
     - **Monofásica**:
       $$\Delta V = \frac{2 \cdot I_{diseño} \cdot L \cdot (R \cdot \cos\phi + X \cdot \sin\phi)}{V_{nominal}} \times 100$$
     Debe cumplirse que: $$\Delta V \leq \Delta V_{max\_permitida}$$

3. **Soportabilidad Térmica al Cortocircuito (Solicitación Térmica)**:
   - Valida que el conductor no se destruya por calor antes de que la protección despeje la falla de cortocircuito ($I_k$ en kA durante un tiempo $t$ en segundos).
   - Fórmula de la constante térmica del material ($K$): Cobre con XLPE ($K=143$), Cobre con PVC ($K=115$), Aluminio con XLPE ($K=94$), etc.
   - Sección mínima requerida por cortocircuito:
     $$S_{min} \geq \frac{I_k \cdot 1000 \cdot \sqrt{t}}{K}$$

### B) Cálculos de Transformadores (`transformador.ts`)
- **Corriente Nominal ($I_{ntr}$)**:
  $$I_{ntr} = \frac{S_{trafo\_kVA} \times 1000}{\sqrt{3} \times V_{secundario}}$$
- **Impedancia de Cortocircuito del Transformador ($Z_{cc}$)**:
  Calcula las componentes de resistencia ($R_{cc}$) y reactancia ($X_{cc}$) del transformador a partir de su potencia de pérdidas en el cobre ($P_{cc}$ en Watts) y su tensión de cortocircuito porcentual ($u_{cc}\%$):
  - Resistencia de cortocircuito:
    $$R_{cc} = \frac{P_{cc}}{3 \cdot I_{ntr}^2}$$
  - Impedancia total de cortocircuito:
    $$Z_{cc} = \frac{u_{cc}\%}{100} \cdot \frac{V_{secundario}^2}{S_{trafo\_VA}}$$
  - Reactancia de cortocircuito:
    $$X_{cc} = \sqrt{Z_{cc}^2 - R_{cc}^2}$$

### C) Selección de Protecciones de Potencia (`seleccionProtecciones.ts`)
Busca en el catálogo de interruptores abiertos (ACB) de ABB y Schneider un equipo adecuado:
- **Corriente Nominal ($I_n$)**: Debe ser mayor o igual a la corriente requerida por el circuito ($I_n \geq I_{requerida}$).
- **Poder de Corte ($I_{cu}$)**: El poder de corte último del interruptor debe ser mayor a la corriente de cortocircuito calculada en el punto de instalación ($I_{cu} \geq I_k$).
- **Poder de Cierre ($I_{cm}$)**: El poder de cierre debe soportar la corriente de pico de cortocircuito ($I_{cm} \geq I_{pico}$).
- **Soportabilidad de Corta Duración ($I_{cw}$)**:
  $$I_{cw}^2 \cdot 1 \text{ seg} \geq I_k^2 \cdot t_{apertura\_MT}$$

---

## 7. Esquema Unifilar Interactivo
El sistema representa los diagramas eléctricos mediante el uso coordinado de:
1. **Esquema Básico en Vivo (`LiveUnifilar.tsx`)**: Un dibujo dinámico ligero utilizando SVG directos para renderizar el transformador, interruptores termo-magnéticos y tableros vinculados.
2. **Editor de Unifilares Completo (`UnifilarCanvas.tsx` / `UnifilarPage.tsx`)**: Una interfaz canvas interactiva que permite posicionar símbolos vectoriales de componentes según el estándar IEC (`IECBreaker`, `IECTransformer`, `IECDisconnectSwitch`, `IECFuse`, `IECEarth`).

---

## 8. Comandos Útiles para el Desarrollador

### Levantar Servidor de Desarrollo
- **Frontend (Vite)**: 
  ```bash
  cd frontend
  npm run dev
  ```
- **Backend (Wrangler local para Cloudflare D1 y API)**:
  ```bash
  wrangler pages dev frontend/dist --compatibility-flag=nodejs_compat --d1=DB
  ```

### Compilar y Validar Tipado (TypeScript y Linters)
- **Frontend**:
  ```bash
  cd frontend
  npm run build
  ```
- **Linter**:
  ```bash
  cd frontend
  npm run lint
  ```

---

*Nota de Uso: Este archivo debe actualizarse si se introducen cambios significativos en la arquitectura, base de datos o en el motor de cálculos del SaaS para que las futuras interacciones de IA tengan siempre la información precisa y actualizada de la base del código.*
