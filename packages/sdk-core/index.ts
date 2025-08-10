// Zebulon Core SDK: Plugin registry and types
export interface ZebulonApp {
  id: string;
  name: string;
  init?: (ctx: any) => Promise<void>;
  routes?: (router: any, ctx: any) => void;
  ui?: { admin?: string; user?: string };
  permissions?: string[];
}

const apps: ZebulonApp[] = [];

export function registerApp(app: ZebulonApp) {
  apps.push(app);
}

export function getApps(): ZebulonApp[] {
  return apps;
}
