import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../../../core/router";
import { AuthGuard } from "@/features/auth/guards";

const homeRoute = createRoute({
  path: '/',
  getParentRoute: () => rootRoute,
  component: () => (
    <AuthGuard>
      <div>Test Home Page</div>
    </AuthGuard>
  ),
});

const homeRoutes = [homeRoute];

export default homeRoutes;
