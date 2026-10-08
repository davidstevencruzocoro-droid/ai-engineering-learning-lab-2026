import { defineConfig } from 'vite';

const configuredBase = process.env.VITE_BASE_PATH;
const normalizedBase = configuredBase?.replace(/^\/+|\/+$/g, '');
const base = normalizedBase ? `/${normalizedBase}/` : '/';

export default defineConfig({
  base,
  server: {
    host: '127.0.0.1',
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:4176',
        changeOrigin: true
      }
    }
  }
});
