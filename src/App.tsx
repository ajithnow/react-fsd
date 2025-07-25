import { RouterProvider } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { router } from './core/router';
import { useFeatureFlag } from './shared/utils/featureFlags';

const queryClient = new QueryClient();

export const App = () => {
  const showDevtools = useFeatureFlag<boolean>('analytics');
  
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      {showDevtools && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
};

export default App;