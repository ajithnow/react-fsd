import { createRoute } from "@tanstack/react-router";
import { rootRoute } from "../../../core/router";
import { HomeComponent } from "../components/HomeComponent.demo";

const homeRoute = createRoute({
  path: '/',
  getParentRoute: () => rootRoute,
  component: HomeComponent,
});

const homeRoutes = [homeRoute];

export default homeRoutes;
