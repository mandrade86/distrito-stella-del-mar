# CMS Distrito Stella del Mar

## Arranque local (MySQL + admin)

1. Subir MySQL:
```bash
docker compose up -d
```

2. Migrar y cargar datos iniciales:
```bash
npm run db:generate
npm run db:push
npm run db:seed
```

3. Correr el sitio:
```bash
npm run dev
```

4. Abrir el panel: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

Credenciales por defecto (`.env`):
- Usuario: `admin@distritostelladelmar.com`
- Contraseña: `Admin123!`

## Qué administra el CMS

| Admin | Qué edita | Público |
| --- | --- | --- |
| `/admin/pages` | Textos de estructura + HTML libre | Rutas fijas |
| `/admin/cms-pages` | Páginas HTML nuevas | `/pagina/[slug]` |
| `/admin/blog` | Novedades / artículos | `/novedades` y `/novedades/[slug]` |
| `/admin/menu` | Menú principal | Header / Footer |
| `/admin/home-widgets` | Orden y visibilidad del Home | `/` |
| `/admin/slides` … | Slides, tiendas, locales, galería, marcas, master plan, leads, ajustes | Según entidad |

**Novedades y Blog están fusionados:** una sola sección pública en `/novedades`. `/blog` redirige ahí.

Si MySQL no está disponible, el sitio público usa los datos estáticos de `src/data/` como fallback.

## Subida de imágenes

En slides, tiendas, galería, marcas y locales puede **subir una imagen** o pegar una URL/ruta.

- Formatos: JPG, PNG, WebP, GIF (máx. 8 MB)
- Se guardan en `public/uploads/` y quedan disponibles como `/uploads/...`
- En Vercel el filesystem no persiste; para producción conviene Vercel Blob u otro storage.
