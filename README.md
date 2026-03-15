# 🚀 React FSD - Feature-Sliced Design Application

> A modern React application built with Feature-Sliced Design architecture, TypeScript, and cutting-edge tools for scalable frontend development.

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.1.0-61dafb.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-7.0.4-646cff.svg)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4.1.11-38bdf8.svg)](https://tailwindcss.com/)
[![Jest](https://img.shields.io/badge/Jest-30.0.5-c21325.svg)](https://jestjs.io/)

## ✨ Features

- 🏗️ **Feature-Sliced Design (FSD)** - Scalable architecture for large applications
- ⚡ **Vite** - Lightning-fast build tool and development server
- 🔷 **TypeScript** - Full type safety with strict configuration
- ⚛️ **React 19** - Latest React with modern features
- 🎨 **ShadCN UI + Tailwind CSS** - Beautiful, accessible UI components
- 🔄 **TanStack Query** - Powerful data fetching and caching
- 🗺️ **TanStack Router** - Type-safe routing
- 📦 **Redux Toolkit** - Industry-standard state management
- 🚩 **Feature Flags** - Runtime feature toggling and A/B testing
- 🧪 **Jest + RTL** - Comprehensive testing setup
- 🌍 **i18next** - Internationalization support
- 🎭 **MSW** - API mocking for development and testing
- 📏 **ESLint + Prettier** - Code quality and formatting
- 🪝 **Husky** - Git hooks for quality assurance

## 🏛️ Architecture

This project follows **Feature-Sliced Design** methodology with clear separation of concerns:

```text
src/
├── features/     # 🎯 Business features (auth, dashboard, etc.)
├── core/         # 🔧 App-level configuration (router, API, i18n)
├── shared/       # 🤝 Reusable components and utilities
├── lib/          # 📚 External library adaptations
└── styles/       # 🎨 Global styles and themes
```

### Dependency Flow

```mermaid
graph TD
    A[Features] --> B[Shared]
    A --> C[Core]
    B --> C
    A --> D[Lib]
    B --> D
    C --> D
```

**Key Principles:**

- ✅ Downward dependencies only
- ❌ No circular dependencies
- 🔄 Cross-feature communication through shared layer

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20+
- **npm** 10+
- **Git**

### Installation

```bash
# Clone repository
git clone https://github.com/your-org/react-fsd.git
cd react-fsd

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

### Available Scripts

```bash
# Development
npm run dev          # Start dev server with HMR
npm run build        # Build for production (TypeScript + Vite)
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run prepare      # Setup Husky git hooks

# Testing
npm test             # Run tests in watch mode
npm run test:ci      # Run tests in CI mode
npm run test:coverage # Run tests with coverage report

# Development Tools
npm run storybook    # Start Storybook component documentation
```

## 📁 Project Structure

Detailed file structure:

```text
src/
├── features/                    # Business Features
│   ├── auth/                   # Authentication feature
│   │   ├── components/         # UI components
│   │   │   └── LoginForm/      # Login form component
│   │   ├── constants/          # Feature constants
│   │   ├── locales/           # i18n translations
│   │   ├── managers/          # Business logic
│   │   ├── mocks/             # MSW handlers
│   │   ├── models/            # TypeScript types
│   │   ├── pages/             # Route components
│   │   ├── queries/           # TanStack Query hooks
│   │   ├── routes/            # Route configuration
│   │   ├── schema/            # Validation schemas
│   │   ├── services/          # API services
│   │   └── stores/            # State management
│   └── config.ts              # Feature-level registry entry
│
├── core/                       # App Infrastructure
│   ├── api/                   # API configuration & endpoints
│   ├── components/            # App-level components
│   ├── i18n/                  # i18n setup
│   ├── mock/                  # MSW configuration
│   ├── registry/              # Centralized feature registries
│   └── router/                # Router setup & root route
│
├── shared/                     # Shared Resources
│   ├── components/            # Reusable components
│   ├── models/                # Common types
│   └── utils/                 # Utility functions
│
│   ├── lib/                        # Library Adaptations
│   └── shadcn/                # ShadCN UI customizations
│       ├── components/ui/     # UI components
│       └── utils/             # UI utilities
│
└── styles/                     # Global Styles
    └── globals.css            # Tailwind + CSS variables
```

### 🧠 Pattern: Handlers, Queries, and Managers

To maintain strict separation of concerns, features should isolate their data-fetching logic from their client-side side-effects:

- **Queries (`features/*/queries/`)**: Strictly responsbile for network requests and React Query state (`isPending`, `error` caching, etc.). Should _not_ contain routing or Redux logic.
- **Managers (`features/*/managers/`)**: Pure UI/Client side orchestration. They provide `onSuccess` or `onError` callbacks that handle updating global state, modifying local storage, triggering toast notifications, or invoking the router.
- **Pages/Components**: Assemble Queries and Managers. They call the query, and pass the result (or error) to the manager functions.

</details>

## 🧩 Adding New Features

Follow our [Feature Development Guide](./docs/DEVELOPMENT.md) to add new features:

```bash
# 1. Create feature structure automatically
# This will guide you through prompts and scaffold all files (routes, stores, etc.)
npm run generate:feature

# 2. Implement feature logic (models → services → stores → components → pages)

# 3. Register automatically
# The new feature's `config.ts` is auto-discovered!
# (Wait for HMR or restart dev server)

# 4. Optional: Manual Redux wiring
# If you chose to include a Store, add the reducer to src/core/store/index.ts
```

### Example Feature Structure

```typescript
// features/dashboard/models/dashboard.model.ts
export interface DashboardData {
  metrics: Metric[];
  charts: ChartData[];
}

// features/dashboard/services/dashboard.service.ts
export const dashboardService = {
  async getMetrics(): Promise<Metric[]> {
    const response = await apiClient.get('/dashboard/metrics');
    return response.data;
  },
};

// features/dashboard/stores/dashboard.store.ts
export const useDashboardStore = create<DashboardState>(set => ({
  data: null,
  isLoading: false,
  fetchData: async () => {
    // Implementation
  },
}));
```

## 🧪 Testing Strategy

We maintain **80% test coverage** with a comprehensive testing approach:

### Test Types

- **Unit Tests** (70%): Components, utilities, services
- **Integration Tests** (20%): Feature workflows
- **E2E Tests** (10%): Critical user journeys

### Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test LoginForm.test.tsx

# Run tests for specific feature
npm test -- --testPathPattern=features/auth
```

### Test Example

```typescript
describe('LoginForm', () => {
  it('should handle form submission with valid data', async () => {
    const user = userEvent.setup();
    const mockOnSubmit = jest.fn();

    render(<LoginForm onSubmit={mockOnSubmit} isLoading={false} />);

    await user.type(screen.getByLabelText(/username/i), 'testuser');
    await user.type(screen.getByLabelText(/password/i), 'password123');
    await user.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        username: 'testuser',
        password: 'password123',
      });
    });
  });
});
```

## 🎨 UI Components

Built with **ShadCN UI** and **Tailwind CSS** for consistent, accessible design:

```typescript
import { Button } from '@/lib/shadcn/components/ui/button';
import { Input } from '@/lib/shadcn/components/ui/input';
import { Card } from '@/lib/shadcn/components/ui/card';

export const ExampleComponent = () => (
  <Card className="p-6">
    <Input placeholder="Enter text..." className="mb-4" />
    <Button className="w-full">
      Submit
    </Button>
  </Card>
);
```

### Theme Support

- 🌅 Light mode
- 🌙 Dark mode
- 🎨 CSS custom properties
- 📱 Responsive design
- ♿ Accessibility compliant

## 🌍 Internationalization

Multi-language support using **react-i18next**:

```typescript
// features/auth/locales/en.json
{
  "login": {
    "title": "Sign In",
    "usernameLabel": "Username",
    "passwordLabel": "Password",
    "loginButton": "Sign In"
  }
}

// Component usage
import { useTranslation } from 'react-i18next';

export const LoginForm = () => {
  const { t } = useTranslation('auth');

  return (
    <form>
      <h1>{t('login.title')}</h1>
      {/* Form fields */}
    </form>
  );
};
```

## 🔄 State Management

### Local State (Redux Toolkit)

```typescript
// Feature-specific slice
export const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, isAuthenticated: false },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    logout: state => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});
```

### Server State (TanStack Query)

```typescript
// Data fetching with caching
export const useUsers = () => {
  return useQuery({
    queryKey: ['users'],
    queryFn: () => userService.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
```

## 📚 Documentation

- 📖 **[Architecture Guide](./docs/ARCHITECTURE.md)** - Detailed FSD architecture
- 🛠️ **[Development Guide](./docs/DEVELOPMENT.md)** - Feature development process
- 🚩 **[Feature Flags Guide](./docs/FEATURE-FLAGS.md)** - Feature flag system usage
- 🧪 **[Testing Guide](./docs/TESTING.md)** - Testing strategies and examples
- 🚀 **[Deployment Guide](./docs/DEPLOYMENT.md)** - Deploy to various platforms
- 🤝 **[Contributing Guide](./docs/CONTRIBUTING.md)** - How to contribute

## 🚀 Deployment

Deploy to multiple platforms with optimized builds:

```bash
# Build for production
npm run build

# Preview build locally
npm run preview
```

### Supported Platforms

- **Vercel** - Zero-config deployment
- **Netlify** - JAMstack deployment
- **GitHub Pages** - Static site hosting
- **Docker** - Containerized deployment

See [Deployment Guide](./docs/DEPLOYMENT.md) for detailed instructions.

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./docs/CONTRIBUTING.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes following our [coding standards](./docs/CONTRIBUTING.md#code-standards)
4. Add tests for new functionality
5. Commit using [conventional commits](./docs/CONTRIBUTING.md#commit-message-format)
6. Push and create a Pull Request

### Code Quality

- ✅ TypeScript strict mode
- ✅ ESLint + Prettier
- ✅ Pre-commit hooks
- ✅ 80% test coverage requirement
- ✅ Automated CI/CD

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Roadmap

- [ ] **Component Library** - Extract reusable components
- [ ] **Storybook Integration** - Component documentation
- [ ] **E2E Testing** - Playwright integration
- [ ] **Performance Monitoring** - Real user metrics
- [ ] **PWA Support** - Service worker integration
- [ ] **Micro-frontend** - Module federation setup

## 🙏 Acknowledgments

- [Feature-Sliced Design](https://feature-sliced.design/) - Architecture methodology
- [ShadCN UI](https://ui.shadcn.com/) - Beautiful component library
- [TanStack](https://tanstack.com/) - Powerful data management tools
- [Vite](https://vitejs.dev/) - Next generation frontend tooling

---
