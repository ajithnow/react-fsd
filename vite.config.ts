import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import EnvironmentPlugin from 'vite-plugin-environment';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), tailwindcss(), EnvironmentPlugin('all')],
    server: {
      port: 3000,
      open: true,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        components: path.resolve(__dirname, './src/components'),
        features: path.resolve(__dirname, './src/features'),
        core: path.resolve(__dirname, './src/core'),
        assets: path.resolve(__dirname, './src/assets'),
        utils: path.resolve(__dirname, './src/utils'),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/styles/variables.scss"; @import "@/styles/mixins.scss";`,
        },
      },
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        '@tanstack/react-router',
        '@tanstack/react-query',
        'i18next',
        'react-i18next',
        'i18next-browser-languagedetector',
      ],
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
      rollupOptions: {
        input: {
          main: 'src/main.tsx',
          auth: 'src/features/auth/routes',
        },
      },
    },
    define: {
      'process.env': {
        API_BASE_URL: JSON.stringify(
          env.VITE_API_BASE_URL || 'http://localhost:3000/api'
        ),
        NODE_ENV: JSON.stringify(env.MODE || 'development'),
        REACT_APP_API_BASE_URL: JSON.stringify(
          env.VITE_API_BASE_URL || 'http://localhost:3000/api'
        ),
        VITE_FEATURE_FLAGS: env.VITE_FEATURE_FLAGS || {},
      },
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./src/setupTests.ts'],
      coverage: {
        provider: 'istanbul',
        reporter: ['text', 'json', 'html'],
        include: ['src/**/*.{ts,tsx}'],
        exclude: [
          'src/**/*.test.{ts,tsx}',
          'src/setupTests.ts',
          'src/main.tsx',
          'src/vite.config.ts',
        ],
      },
    },
  };
});
