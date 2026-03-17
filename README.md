# NOVURAXE

Plataforma de gestión de torneos de axe throwing. Clasificaciones en tiempo real, brackets automáticos, estadísticas y vista espectador en vivo.

---

## Stack

- **Next.js 16** — framework principal
- **React 19** — UI
- **Supabase** — base de datos, autenticación y storage
- **Vercel** — deploy

---

## Páginas

| Ruta | Descripción |
|------|-------------|
| `/` | Landing page |
| `/organizer` | Panel del organizador (HTML vanilla) |
| `/player` | Portal del jugador |
| `/live` | Vista espectador en tiempo real |
| `/terms` | Términos y condiciones |

---

## Instalación local

```bash
# Instalar dependencias
npm install --legacy-peer-deps

# Crear archivo de entorno
cp .env.example .env.local
# Rellenar NEXT_PUBLIC_SUPA_URL y NEXT_PUBLIC_SUPA_KEY

# Arrancar servidor de desarrollo
npm run dev
```

---

## Variables de entorno

Crea un archivo `.env.local` en la raíz con:

```
NEXT_PUBLIC_SUPA_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPA_KEY=tu-anon-key
```

---

## Deploy

El proyecto está desplegado en Vercel conectado al repo `novuraxe-v2`. Cada push a `main` lanza un deploy automático.

Las variables de entorno se configuran en Vercel → Settings → Environment Variables.

---

## Estructura

```
pages/
  index.jsx          # Landing
  player.jsx         # Portal jugador
  live.jsx           # Vista espectador
  terms.jsx          # Términos
  organizer.jsx      # Sirve organizer.html con env vars
  api/
    organizer.js     # Inyecta credenciales en organizer.html
public/
  organizer.html     # Panel organizador (vanilla JS)
styles/
  globals.css        # Reset global
  landing.css        # Estilos landing
lib/
  supabase.js        # Cliente Supabase compartido
```