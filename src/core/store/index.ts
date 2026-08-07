import { configureStore, combineReducers } from '@reduxjs/toolkit';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from '@/features/auth/stores/auth.slice.ts';
import navigationGuardReducer from '@/shared/store/navigationGuard.slice';

const rootReducer = combineReducers({
  auth: authReducer,
  navigationGuard: navigationGuardReducer,
  // Add other slices here
});

/**
 * v2: stop persisting auth.user — tokens live in authStorage;
 * session identity is loaded from `/me` in SessionBootstrap.
 */
const persistConfig = {
  key: 'root',
  version: 2,
  storage,
  whitelist: [] as string[],
  migrate: async () => undefined,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
