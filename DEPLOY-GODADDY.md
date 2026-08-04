# Despliegue en GoDaddy — 2 sitios (pruebas + producción)

Este proyecto es **Next.js 15 + MySQL (Prisma)**. No corre en hosting compartido solo-PHP.
En GoDaddy usar una de estas opciones:

1. **VPS** (recomendado) con Node 20 + MySQL, o Docker  
2. **cPanel “Setup Node.js App”** (si el plan lo incluye) + MySQL en cPanel  

| Entorno | Uso | `NEXT_PUBLIC_SITE_ENV` | Indexación Google |
|--------|-----|-------------------------|-------------------|
| **Staging / pruebas** | Validar contenido y CMS | `staging` | Bloqueada (`noindex`) |
| **Producción** | Sitio público | `production` | Permitida |

**Bases de datos distintas** para cada sitio. Nunca compartir `DATABASE_URL`.

### Panel GoDaddy sin terminal (Build / Start)

En la configuración de la app (Git deploy):

| Campo | Poner exactamente |
|-------|-------------------|
| **Install** | `npm ci` o `npm install` |
| **Build** | `npm run build` |
| **Start** | `npm start` |

**No uses** `NODE_ENV=production npm run build`. Ese prefijo hace que fallen installs/builds (se saltan dependencias de compilación).

Secrets: `BLOB_READ_WRITE_TOKEN`, `DB_*` **o** `DATABASE_URL`, `ADMIN_SESSION_SECRET`, etc. Luego **Redeploy**.

Con `DB_HOST` / `DB_USER` / `DB_PASSWORD` / `DB_NAME`, `npm start` arma `DATABASE_URL` solo para Prisma (no hace falta duplicarla). Si el panel insiste, también puedes poner `DATABASE_URL` a mano.

---

## 1. Preparar variables

En el servidor de **pruebas**:

```bash
cp .env.staging.example .env
# Editar .env con URLs, MySQL y secretos reales
```

En el servidor de **producción**:

```bash
cp .env.production.example .env
# Editar .env
```

Campos críticos:

- `NEXT_PUBLIC_SITE_URL` — URL pública exacta (https://…)
- `NEXT_PUBLIC_SITE_ENV` — `staging` o `production`
- `DATABASE_URL` — MySQL del entorno
- `ADMIN_SESSION_SECRET` — cadena larga y distinta en cada sitio
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — acceso `/admin`

Los `NEXT_PUBLIC_*` se “hornean” en el **build**. Si cambias URL o env, vuelve a hacer `npm run build`.

### `DATABASE_URL` / Secrets de MySQL

**Si el hosting adjunta la base (Secrets card)** verá `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`.  
La app las lee sola y arma la conexión Prisma — **no hace falta** poner `DATABASE_URL` a mano con `localhost`.

**Si usa cPanel MySQL clásico** (sin Secrets DB_*):

1. cPanel → **MySQL Databases**: cree BD + usuario y asigne **ALL PRIVILEGES**.
2. Formato:

```env
DATABASE_URL="mysql://USUARIO:PASSWORD@127.0.0.1:3306/NOMBRE_BD"
```

Notas:

- Prefiera `127.0.0.1` sobre `localhost` (evita fallos IPv6).
- El usuario suele verse como `cuenta_usuario`.
- Si el password tiene `@ # % &` etc., **encodeéelo en URL** (ej. `@` → `%40`).
- En **Setup Node.js App → Environment Variables** agregue las variables que use.
- Tras crear la BD:

```bash
npx prisma db push
npx tsx prisma/seed.ts
```

3. Prueba: `https://su-dominio/api/health` → `"database":"connected"`.  
   El campo `dbSource` indica si usó `DB_*` o `DATABASE_URL`.

---

## 2. Opción A — VPS con Docker (más simple de mantener)

### Staging

```bash
docker compose -f docker-compose.staging.yml --env-file .env up -d --build
docker compose -f docker-compose.staging.yml exec web npx prisma db push
docker compose -f docker-compose.staging.yml exec web npx tsx prisma/seed.ts
```

Puerto por defecto: **3001**. Apunta el subdominio `staging.` al VPS (proxy Nginx/Apache → `127.0.0.1:3001`).

### Producción

```bash
docker compose -f docker-compose.production.yml --env-file .env up -d --build
docker compose -f docker-compose.production.yml exec web npx prisma db push
docker compose -f docker-compose.production.yml exec web npx tsx prisma/seed.ts
```

Puerto por defecto: **3000**. Dominio principal → `127.0.0.1:3000`.

SSL: Let’s Encrypt en el proxy (Nginx/Caddy) o SSL de GoDaddy.

---

## 3. Opción B — cPanel Node.js App (sin Docker)

En **cada** cuenta/subdominio (pruebas y producción):

1. Crear base MySQL en cPanel (usuario + BD + permisos).
2. **Setup Node.js App** → Node **20.x**, Application root = carpeta del proyecto.
3. Subir el código (Git o ZIP).
4. Crear `.env` (staging o production según el sitio).
5. En la terminal de la app:

```bash
npm ci
npx prisma generate
npx prisma db push
npm run build
# Opcional primera vez:
npx tsx prisma/seed.ts
```

6. Application startup file:

- Preferido (standalone): el script `npm run build` **ya copia** `public/` (imágenes, logos, masterplan) y `.next/static` dentro de `.next/standalone`.

```bash
npm ci
npx prisma generate
npx prisma db push
npm run build
# Opcional primera vez:
npx tsx prisma/seed.ts
```

Si en algún plan el copy no corrió:

```bash
npm run deploy:copy-public
# equivalente a:
# cp -r public .next/standalone/public
# cp -r .next/static .next/standalone/.next/static
```

Startup: `.next/standalone/server.js`  
o script npm: `start` → `next start -H 0.0.0.0` (cPanel inyecta `PORT`).

**Imágenes:** van en `public/images/` (en git). Tras cada build/deploy deben existir en `public/` junto al `server.js` standalone. Uploads del CMS viven en `public/uploads/` (persistir en disco; no están en git).

7. Reiniciar la aplicación Node en cPanel.

### Imágenes del CMS (cambian en cualquier momento)

En GoDaddy con **Git-connected** el File Manager es de solo lectura: `public/uploads/` **no sirve** para el CMS.

**Solución: Vercel Blob** (la app puede seguir en GoDaddy; solo usa el storage):

1. En [vercel.com/dashboard](https://vercel.com/dashboard) → **Storage** → cree un **Blob** store.
2. Copie el token `BLOB_READ_WRITE_TOKEN`.
3. En GoDaddy → Secrets / Environment Variables de la app Node, agregue:
   ```
   BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...
   ```
4. Redeploy / reinicie la app.
5. En **Admin** suba planos, logos, etc. como siempre → se guardan en la nube y la URL queda en MySQL.

Sin ese token, en hosting de solo lectura el CMS mostrará un error pidiendo configurarlo.

(Localmente, sin el token, sigue usando `public/uploads/`.)

### Sitio en vivo (preview privado)

En **Admin → Ajustes** hay un interruptor **Sitio en vivo**:

- Apagado (default al seed): el público ve “Pronto abriremos”; solo quien inicia sesión en `/admin` ve el sitio.
- Encendido: sitio abierto a todos.

Opcional en env: `SITE_LIVE=true|false` fuerza el modo (prioridad sobre el toggle).

Repetir el mismo proceso en el **otro** dominio/subdominio con su propio `.env` y su propia BD.

### PM2 (si tienes SSH)

```bash
npm run deploy:prepare
cp -r .next/static .next/standalone/.next/static
cp -r public .next/standalone/public
pm2 start ecosystem.config.cjs --only distrito-staging   # o distrito-prod
pm2 save
```

Las variables sensibles deben estar en `.env` en la raíz del proyecto (Prisma/Next las leen) o exportadas en el entorno del proceso.

---

## 4. Dominios en GoDaddy

Ejemplo típico:

| DNS | Destino |
|-----|---------|
| `A` / `AAAA` `distritostelladelmar.com` | IP del VPS / hosting prod |
| `CNAME` `www` | dominio principal |
| `A` / `CNAME` `staging` | IP/hosting de pruebas |

Si usas dos cuentas cPanel: cada una con su dominio apuntado.

---

## 5. Checklist por entorno

- [ ] `.env` correcto (`SITE_ENV`, URL, MySQL, secretos)
- [ ] `npm run build` sin errores
- [ ] `/` carga y el logo se ve
- [ ] `/admin` inicia sesión
- [ ] Subida de imágenes CMS escribe en `public/uploads` (permisos de escritura)
- [ ] Staging: `robots.txt` bloquea indexación
- [ ] Producción: HTTPS y correo Resend (dominio verificado) si usas formulario
- [ ] Backups de MySQL programados (sobre todo producción)

---

## 6. Actualizar el sitio

```bash
git pull
npm ci
npx prisma db push
npm run build
# reiniciar Node app / pm2 restart / docker compose up -d --build
```

Flujo recomendado: desplegar y probar primero en **staging**; si todo está bien, repetir en **producción**.

---

## 7. Nota importante

Hosting compartido clásico de GoDaddy (solo archivos estáticos/PHP) **no** sirve para esta app.
Si el plan actual no incluye Node 20 ni VPS, hay que subir de plan o usar el dominio de GoDaddy apuntando a un VPS/Node compatible.
