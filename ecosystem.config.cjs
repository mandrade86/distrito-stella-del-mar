/**
 * PM2 — útil en VPS GoDaddy / cPanel sin Docker.
 *
 * Staging:  pm2 start ecosystem.config.cjs --only distrito-staging
 * Producción: pm2 start ecosystem.config.cjs --only distrito-prod
 *
 * Antes: npm ci && npx prisma db push && npm run build
 * Tras build standalone, copiar static:
 *   cp -r .next/static .next/standalone/.next/static
 *   cp -r public .next/standalone/public
 */
module.exports = {
  apps: [
    {
      name: "distrito-staging",
      cwd: "./.next/standalone",
      script: "server.js",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3001,
        HOSTNAME: "0.0.0.0",
      },
    },
    {
      name: "distrito-prod",
      cwd: "./.next/standalone",
      script: "server.js",
      instances: 1,
      exec_mode: "fork",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        HOSTNAME: "0.0.0.0",
      },
    },
  ],
};
