import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  vite: {
    plugins: [svgr()],
    server: {
      allowedHosts: [],
    },
  },
  integrations: [
    react({
      include: ['**/react/*'],
    }),
    tailwind(),
  ],
});
