import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig(({ mode }) => {
  // Load environment variables from .env files
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react({
        babel: {
          plugins: [
            ['@babel/plugin-transform-react-jsx', { runtime: 'automatic' }],
          ],
        },
      }),
      tailwindcss(),
    ],
    server: {
      port: 3000,
      open: true,
    },
    preview: {
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
      // Increase the chunk size warning limit to reduce noisy warnings
      // and provide manual chunking for large vendor libraries to keep
      // individual chunks smaller after minification.
      chunkSizeWarningLimit: 1000, // in KB
      rollupOptions: {
        output: {
          manualChunks(id: string) {
            if (id.includes('node_modules')) {
              // Keep large, focused chunks for big dependencies to reduce overall
              // vendor bundle size and improve long-term caching.

              // TanStack libs in one chunk
              if (id.includes('@tanstack')) return 'tanstack';

              // i18n related libs together
              if (id.includes('i18next') || id.includes('react-i18next')) return 'i18n';

              // Icon libraries (lucide, tabler) are used widely in the UI
              if (id.includes('lucide-react') || id.includes('@tabler')) return 'icons';

              // Charts / visualization libraries
              if (id.includes('recharts') || id.includes('d3')) return 'charts';

              // Firebase is big and can be cached separately
              if (id.includes('firebase')) return 'firebase';

              // Notification/toast library
              if (id.includes('sonner')) return 'sonner';

              // Keep Radix UI in the main vendor chunk to avoid circular
              // cross-chunk dependencies (Radix imports many helpers that
              // other vendor code expects synchronously).

              // Lightweight state libs
              if (id.includes('zustand')) return 'state';

              // Fallback: put remaining node_modules into vendor
              return 'vendor';
            }
          },
        },
      },
    },
    define: {
      __DEV__: JSON.stringify(mode === 'development'),
      'process.env.NODE_ENV': JSON.stringify(env.NODE_ENV || mode),
      'process.env.MODE': JSON.stringify(mode),
      'process.env.VITE_API_BASE_URL': JSON.stringify(
        env.VITE_API_BASE_URL || 'http://localhost:3000/api'
      ),
      'process.env.VITE_MOCK_API_BASE_URL': JSON.stringify(
        env.VITE_MOCK_API_BASE_URL || 'http://localhost:3000/api'
      ),
      'process.env.VITE_FEATURE_FLAGS': JSON.stringify(
        env.VITE_FEATURE_FLAGS || '{}'
      ),
      'process.env.VITE_I18N_DEBUG': JSON.stringify(
        env.VITE_I18N_DEBUG || 'false'
      ),
      'process.env.VITE_MSW_ENABLED': JSON.stringify(
        env.VITE_MSW_ENABLED || 'false'
      ),
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
