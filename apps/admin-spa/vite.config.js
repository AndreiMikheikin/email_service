import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig(({ mode, ssrBuild }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: '/admin-spa/',
    plugins: [react()],
    server: {
      port: 3344,
      proxy: {
        '/api': {
          target: env.VITE_API_URL || 'http://localhost:3355',
          changeOrigin: true,
          secure: false,
        },
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          api: 'modern-compiler',
        },
      },
    },

    build: ssrBuild
      ? {
          ssr: 'src/entry-server.jsx',
          outDir: 'dist/server',
          emptyOutDir: false, // важно не чистить index.html
          rollupOptions: {
            input: 'src/entry-server.jsx',
            external: ['react', 'react-dom'],
          },
          minify: false,
        }
      : {
          outDir: 'dist',
          emptyOutDir: true, // чистим перед клиентской сборкой
          rollupOptions: {
            input: 'index.html', // или 'src/index.html' — если он у тебя там
          },
        },

    ssr: {
      noExternal: ['react', 'react-dom'],
    },

    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  };
});