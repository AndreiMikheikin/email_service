import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

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

    // Отдельные настройки для билда SSR и клиентского билда
    build: ssrBuild
      ? {
          ssr: 'src/entry-server.jsx', // точка входа для SSR
          outDir: 'dist/server', // выводим серверный бандл сюда
          rollupOptions: {
            input: 'src/entry-server.jsx',
            external: ['react', 'react-dom'], // можно расширить список
          },
          minify: false, // по желанию
        }
      : {
          outDir: 'dist',
          rollupOptions: {
            input: 'src/entry-client.jsx', // клиентский вход
          },
        },

    ssr: {
      noExternal: ['react', 'react-dom'], // чтобы не делать внешними зависимости для SSR
    },

    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
  };
});