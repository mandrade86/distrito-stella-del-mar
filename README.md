# Distrito Stella del Mar

Sitio web premium (Next.js 15) para el desarrollo comercial **Distrito Stella del Mar** en Puerto Cortés, Honduras.

## Stack

- Next.js 15 (App Router)
- React 19 + TypeScript
- Tailwind CSS 4
- Framer Motion
- Lucide React
- React Hook Form + Zod

## Instalación

```bash
npm install
cp .env.example .env.local
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Desarrollo (Turbopack) |
| `npm run build` | Build de producción (sin Turbopack) |
| `npm run start` | Servidor de producción |
| `npm run deploy:prepare` | `npm ci` + schema DB + build |
| `npm run lint` | ESLint |

## Estructura

```
src/app/                 # Rutas App Router + API
src/components/layout/   # Header, Footer, WhatsApp
src/components/sections/ # Secciones de la landing
src/components/ui/       # UI reutilizable
src/config/contact.ts    # Contacto / env
src/data/                # Locales, galería, master plan
src/lib/                 # Utils y validaciones
public/images/           # Logos, renders, masterplan
```

## Variables de entorno

Ver [`.env.example`](.env.example):

- `NEXT_PUBLIC_SITE_URL`
- `NEXT_PUBLIC_CONTACT_EMAIL`
- `NEXT_PUBLIC_CONTACT_PHONE`
- `NEXT_PUBLIC_WHATSAPP_NUMBER`
- `NEXT_PUBLIC_MAPS_URL`
- `NEXT_PUBLIC_MAP_LAT` / `NEXT_PUBLIC_MAP_LNG`
- `NEXT_PUBLIC_FACEBOOK_URL` / `INSTAGRAM` / `LINKEDIN` / `TIKTOK`

Valores no configurados aparecen como pendientes en UI (no se inventan datos).

## Coordinadas / mapa

1. Obtén lat/lng del predio.
2. Define `NEXT_PUBLIC_MAP_LAT` y `NEXT_PUBLIC_MAP_LNG`.
3. Opcional: `NEXT_PUBLIC_MAPS_URL` con el enlace de Google Maps.

## Contacto API

`POST /api/contact` valida el payload con Zod. En desarrollo registra en consola.  
Integrar SendGrid, Resend o CRM en [`src/app/api/contact/route.ts`](src/app/api/contact/route.ts).

## Assets

Logos oficiales y renders viven en `public/images/`. No recrear el logo con CSS/IA.

## Datos pendientes de confirmar

- Teléfono, correo, WhatsApp y redes sociales
- Coordenadas exactas / URL de Google Maps
- Logos oficiales de marcas ancla (hoy tipográficos)
- Planos master plan vectoriales/PDF formales
- Inventario real de locales y estados
- Integración de correo/CRM en `/api/contact`

## Deploy

### GoDaddy (pruebas + producción)

Ver la guía completa: [`DEPLOY-GODADDY.md`](DEPLOY-GODADDY.md).

Resumen:

1. Copiar `.env.staging.example` o `.env.production.example` → `.env` en cada servidor.
2. Node **20+** + MySQL (bases **separadas**).
3. `npm run deploy:prepare` (o Docker compose staging/production).
4. Staging usa `NEXT_PUBLIC_SITE_ENV=staging` (no se indexa). Producción = `production`.

### Vercel (alternativa)

```bash
npx vercel --prod
```

Configurar las mismas variables de entorno en el panel de Vercel (un proyecto staging y otro production, o preview + production).
