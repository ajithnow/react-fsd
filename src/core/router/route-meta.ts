import type { AnyRoute } from '@tanstack/react-router';

/** How assembly attaches a feature route to the shell layout tree. */
export type RouteLayout = 'app' | 'auth' | 'standalone';

declare module '@tanstack/react-router' {
  interface StaticDataRouteOption {
    /** Declares layout parent during route assembly. Defaults to `app`. */
    layout?: RouteLayout;
  }
}

interface RouteWithMeta {
  options?: { staticData?: { layout?: RouteLayout } };
  staticData?: { layout?: RouteLayout };
}

/** Resolve layout intent from route `staticData`, defaulting to authenticated app shell. */
export function getRouteLayout(route: AnyRoute): RouteLayout {
  const meta = route as unknown as RouteWithMeta;
  return (
    meta.options?.staticData?.layout ??
    meta.staticData?.layout ??
    'app'
  );
}
