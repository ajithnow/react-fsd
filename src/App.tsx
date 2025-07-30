import { RouterProvider } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { router } from './core/router';
import { RBACProvider } from './core/rbac';
import { useAuthStore } from './features/auth/stores/auth.store';

const queryClient = new QueryClient();

export const App = () => {
  const { user } = useAuthStore();
  
  return (
    <QueryClientProvider client={queryClient}>
      <RBACProvider user={user}>
        <RouterProvider router={router} />
        {process.env.NODE_ENV === 'development' && (
          <ReactQueryDevtools initialIsOpen={true} />
        )}
      </RBACProvider>
    </QueryClientProvider>
  );
};

export default App;