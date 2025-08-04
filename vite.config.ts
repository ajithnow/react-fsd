import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
    plugins: [react(), tailwindcss()],
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
      __DEV__: JSON.stringify(mode === 'development'),
      'process.env.NODE_ENV': JSON.stringify(env.NODE_ENV || mode),
      'process.env.MODE': JSON.stringify(mode),
      'process.env.VITE_API_BASE_URL': JSON.stringify(env.VITE_API_BASE_URL || 'http://localhost:3000/api'),
      'process.env.VITE_FEATURE_FLAGS': JSON.stringify(env.VITE_FEATURE_FLAGS || '{}'),
      'process.env.VITE_I18N_DEBUG': JSON.stringify(env.VITE_I18N_DEBUG || 'false'),
      'process.env.VITE_MSW_ENABLED': JSON.stringify(env.VITE_MSW_ENABLED || 'false'),
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
