import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const root = __dirname;

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      resolve: {
        alias: {
          '@': root,
          '@landing': path.resolve(root, 'landing'),
          '@app': path.resolve(root, 'app'),
          '@shared': path.resolve(root, 'shared'),
          '@backend': path.resolve(root, 'backend'),
        }
      },
      build: {
        rollupOptions: {
          output: {
            manualChunks: {
              'vendor-react': ['react', 'react-dom', 'react-router-dom'],
              'vendor-motion': ['motion', 'framer-motion'],
              'vendor-lucide': ['lucide-react']
            }
          }
        },
        minify: 'esbuild',
      },
      esbuild: {
        drop: mode === 'production' ? ['console', 'debugger'] : [],
      }
    };
});
