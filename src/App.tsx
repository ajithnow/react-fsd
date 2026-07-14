import { RouterProvider } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { SessionBootstrap } from '@/features/auth/components/SessionBootstrap';
import { router } from './core/router';
import { store, persistor } from './core/store';
import { ENV } from './core/utils/env.utils';

const queryClient = new QueryClient();

export const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SessionBootstrap>
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
            {ENV.IS_DEV && <ReactQueryDevtools initialIsOpen={true} />}
          </QueryClientProvider>
        </SessionBootstrap>
      </PersistGate>
    </Provider>
  );
};

export default App;
