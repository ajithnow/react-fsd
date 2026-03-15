import { RouterProvider } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Provider, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { router } from './core/router';
import { RBACProvider } from './core/rbac';
import { store, persistor, RootState } from './core/store';
import { ENV } from './core/utils/env.utils';

const queryClient = new QueryClient();

export const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppContent />
      </PersistGate>
    </Provider>
  );
};

const AppContent = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  
  return (
    <QueryClientProvider client={queryClient}>
      <RBACProvider user={user}>
        <RouterProvider router={router} />
        {ENV.IS_DEV && (
          <ReactQueryDevtools initialIsOpen={true} />
        )}
      </RBACProvider>
    </QueryClientProvider>
  );
};

export default App;