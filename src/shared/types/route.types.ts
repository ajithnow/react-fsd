export type RouteValues<T> = T[keyof T];

export type RouteRecord = Record<string, string>;

export type CrudRouteNames = {
  LIST: string;
  CREATE: string;
  EDIT: string;
  VIEW: string;
  DELETE: string;
};

export type ModuleRoutes<T extends RouteRecord> = {
  [K in keyof T]: string;
};
