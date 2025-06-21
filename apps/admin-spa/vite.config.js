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
        emptyOutDir: true,  // очищаем только dist/server
        rollupOptions: {
          input: 'src/entry-server.jsx',
          output: {
            format: 'esm' // Формат указываем здесь
          },
          external: ['react', 'react-dom'],
        },
        minify: false,
      }
      : {
        outDir: 'dist/client',
        manifest: true,
        rollupOptions: {
          output: {
            entryFileNames: 'assets/[name]-[hash].js',
            assetFileNames: 'assets/[name]-[hash][extname]'
          }
        }
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