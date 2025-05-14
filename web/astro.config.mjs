import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import svgr from 'vite-plugin-svgr';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://peak2peak.life',
  vite: {
    plugins: [svgr(), tailwindcss()],
    server: {
      allowedHosts: [],
    },
  },
  integrations: [
    react({
      include: ['**/react/*'],
    }),
  ],
});
