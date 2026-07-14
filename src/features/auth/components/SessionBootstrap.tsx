import { useEffect, useState, type ReactNode } from 'react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '@/core/store';
import { logger } from '@/core/services/logger.service';
import { getProfile } from '../services/profile.service';
import { setUser } from '../stores/auth.slice';
import { authStorage, isAuthenticated } from '../utils';

type SessionBootstrapProps = {
  children: ReactNode;
};

/**
 * After redux-persist rehydration, refreshes session identity from `/me`
 * before the router runs permission guards. Tokens stay in storage; user
 * lives only in Redux.
 */
export function SessionBootstrap({ children }: SessionBootstrapProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      authStorage.purgeLegacyUser();

      if (!isAuthenticated()) {
        dispatch(setUser(null));
        if (!cancelled) setReady(true);
        return;
      }

      try {
        const user = await getProfile();
        if (!cancelled) {
          dispatch(setUser(user));
        }
      } catch (error) {
        logger.error('Session bootstrap failed', error, 'SessionBootstrap');
        authStorage.clearTokens();
        dispatch(setUser(null));
      } finally {
        if (!cancelled) setReady(true);
      }
    };

    void bootstrap();

    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  if (!ready) {
    return null;
  }

  return children;
}
