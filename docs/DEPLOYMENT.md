# 🚀 Deployment Guide

## Overview

This guide covers deployment strategies and configurations for the React Feature-Sliced Design application across different environments and platforms.

## Build Configuration

### Production Build

The application use1. **Nginx Configuration**:

````nginx
# nginx.conf
user nginx;
worker_processes auto;

events {
    worker_connections 1024;
} building with optimized production settings:

```json
{
  "scripts": {
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "build:analyze": "npm run build && npx vite-bundle-analyzer dist"
  }
}
````

### Build Optimization

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['@tanstack/react-router'],
          ui: ['@radix-ui/react-label', '@radix-ui/react-slot'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
```

## Environment Configuration

### Environment Variables

Create environment files for different deployment stages:

```bash
# .env.local (development)
VITE_API_BASE_URL=http://localhost:3001/api
VITE_APP_ENV=development
VITE_ENABLE_MSW=true

# .env.staging
VITE_API_BASE_URL=https://api-staging.yourapp.com/api
VITE_APP_ENV=staging
VITE_ENABLE_MSW=false

# .env.production
VITE_API_BASE_URL=https://api.yourapp.com/api
VITE_APP_ENV=production
VITE_ENABLE_MSW=false
```

### Runtime Configuration

```typescript
// core/config/env.ts
interface EnvConfig {
  API_BASE_URL: string;
  APP_ENV: 'development' | 'staging' | 'production';
  ENABLE_MSW: boolean;
}

export const env: EnvConfig = {
  API_BASE_URL:
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  APP_ENV: import.meta.env.VITE_APP_ENV || 'development',
  ENABLE_MSW: import.meta.env.VITE_ENABLE_MSW === 'true',
};

// Validation
if (!env.API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL is required');
}
```

## Platform Deployments

### Vercel Deployment

1. **Configuration File**:

```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "VITE_API_BASE_URL": "@api-base-url"
  },
  "functions": {
    "app/api/*.ts": {
      "runtime": "nodejs18.x"
    }
  }
}
```

1. **Deploy Command**:

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Netlify Deployment

1. **Configuration File**:

```ini
# netlify.toml
[build]
  publish = "dist"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[context.production.environment]
  VITE_API_BASE_URL = "https://api.yourapp.com/api"
  VITE_APP_ENV = "production"

[context.deploy-preview.environment]
  VITE_API_BASE_URL = "https://api-staging.yourapp.com/api"
  VITE_APP_ENV = "staging"
```

1. **Deploy with CLI**:

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

### GitHub Pages

1. **GitHub Actions Workflow**:

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm run test:ci

      - name: Build
        run: npm run build
        env:
          VITE_API_BASE_URL: ${{ secrets.API_BASE_URL }}
          VITE_APP_ENV: production

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        if: github.ref == 'refs/heads/main'
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

1. **Base Path Configuration**:

```typescript
// vite.config.ts
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/your-repo-name/' : '/',
  // ... rest of config
});
```

### Docker Deployment

1. **Dockerfile**:

```dockerfile
# Build stage
FROM node:18-alpine as builder

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built application
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

1. **Nginx Configuration**:

```nginx
# nginx.conf
user nginx;
worker_processes auto;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    sendfile on;
    keepalive_timeout 65;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;

        # Handle client-side routing
        location / {
            try_files $uri $uri/ /index.html;
        }

        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
    }
}
```

1. **Docker Compose**:

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - '3000:80'
    environment:
      - NODE_ENV=production
    restart: unless-stopped

  # Optional: Add reverse proxy
  nginx:
    image: nginx:alpine
    ports:
      - '80:80'
      - '443:443'
    volumes:
      - ./nginx-proxy.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped
```

## CI/CD Pipeline

### GitHub Actions Complete Pipeline

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '18'

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run type check
        run: npm run type-check

      - name: Run tests
        run: npm run test:ci

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
          flags: unittests
          name: codecov-umbrella

  build:
    needs: test
    runs-on: ubuntu-latest

    strategy:
      matrix:
        environment: [staging, production]

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build for ${{ matrix.environment }}
        run: npm run build
        env:
          VITE_API_BASE_URL: ${{ secrets[format('API_BASE_URL_{0}', upper(matrix.environment))] }}
          VITE_APP_ENV: ${{ matrix.environment }}

      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: build-${{ matrix.environment }}
          path: dist/
          retention-days: 7

  deploy-staging:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    environment: staging

    steps:
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: build-staging
          path: dist/

      - name: Deploy to staging
        run: |
          # Add your staging deployment commands here
          echo "Deploying to staging..."

  deploy-production:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: production

    steps:
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: build-production
          path: dist/

      - name: Deploy to production
        run: |
          # Add your production deployment commands here
          echo "Deploying to production..."
```

## Performance Optimization

### Bundle Analysis

```bash
# Analyze bundle size
npm run build:analyze

# Or use webpack-bundle-analyzer
npx webpack-bundle-analyzer dist/assets/*.js
```

### Code Splitting

```typescript
// Lazy load features
const AuthFeature = lazy(() => import('@/features/auth'));
const DashboardFeature = lazy(() => import('@/features/dashboard'));

// In router configuration
const authRoute = createRoute({
  path: '/auth',
  component: () => (
    <Suspense fallback={<LoadingSpinner />}>
      <AuthFeature />
    </Suspense>
  ),
});
```

### Asset Optimization

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        assetFileNames: assetInfo => {
          let extType = assetInfo.name.split('.').at(1);
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            extType = 'img';
          }
          return `assets/${extType}/[name]-[hash][extname]`;
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
  },
});
```

## Monitoring & Analytics

### Error Tracking

```typescript
// core/monitoring/sentry.ts
import * as Sentry from '@sentry/react';

if (env.APP_ENV === 'production') {
  Sentry.init({
    dsn: env.SENTRY_DSN,
    environment: env.APP_ENV,
    tracesSampleRate: 1.0,
    integrations: [
      new Sentry.BrowserTracing(),
    ],
  });
}

// Error boundary
export const ErrorBoundary = Sentry.withErrorBoundary(App, {
  fallback: ({ error, resetError }) => (
    <div>
      <h2>Something went wrong</h2>
      <button onClick={resetError}>Try again</button>
    </div>
  ),
});
```

### Analytics

```typescript
// core/analytics/index.ts
import { env } from '../config/env';

interface Analytics {
  track: (event: string, properties?: Record<string, any>) => void;
  identify: (userId: string, traits?: Record<string, any>) => void;
}

class AnalyticsService implements Analytics {
  track(event: string, properties?: Record<string, any>) {
    if (env.APP_ENV === 'production') {
      // Google Analytics, Mixpanel, etc.
      gtag('event', event, properties);
    }
  }

  identify(userId: string, traits?: Record<string, any>) {
    if (env.APP_ENV === 'production') {
      gtag('config', 'GA_TRACKING_ID', {
        user_id: userId,
        custom_map: traits,
      });
    }
  }
}

export const analytics = new AnalyticsService();
```

## Security Considerations

### Content Security Policy

```html
<!-- index.html -->
<meta
  http-equiv="Content-Security-Policy"
  content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google-analytics.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https:;
  connect-src 'self' https://api.yourapp.com wss://api.yourapp.com;
"
/>
```

### Environment Variable Security

```typescript
// Never expose sensitive data in client-side code
const publicConfig = {
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL,
  APP_ENV: import.meta.env.VITE_APP_ENV,
};

// Validate required environment variables
const requiredEnvVars = ['VITE_API_BASE_URL'];
const missingEnvVars = requiredEnvVars.filter(
  envVar => !import.meta.env[envVar]
);

if (missingEnvVars.length > 0) {
  throw new Error(
    `Missing required environment variables: ${missingEnvVars.join(', ')}`
  );
}
```

## Rollback Strategy

### Deployment Rollback

```bash
# Vercel rollback
vercel rollback [deployment-url]

# Netlify rollback
netlify deploy --alias [previous-deploy-id]

# Docker rollback
docker tag your-app:previous your-app:latest
docker-compose up -d
```

### Feature Flags

```typescript
// core/feature-flags/index.ts
interface FeatureFlags {
  NEW_DASHBOARD: boolean;
  EXPERIMENTAL_AUTH: boolean;
}

export const featureFlags: FeatureFlags = {
  NEW_DASHBOARD: env.APP_ENV !== 'production',
  EXPERIMENTAL_AUTH: false,
};

// Usage in components
export const DashboardPage = () => {
  if (featureFlags.NEW_DASHBOARD) {
    return <NewDashboard />;
  }
  return <LegacyDashboard />;
};
```

This deployment guide provides comprehensive coverage for deploying your Feature-Sliced Design application across various platforms while maintaining security, performance, and reliability standards.
