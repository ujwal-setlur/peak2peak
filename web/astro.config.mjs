import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  site: 'https://peak2peak.life',
  vite: {
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
