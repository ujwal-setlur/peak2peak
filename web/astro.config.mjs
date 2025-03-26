// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

export default defineConfig({
  vite: {
    server: {
      allowedHosts: [],
    },
  },
  integrations: [react(), tailwind()],
});
