// Zeta App Placeholder
import { ZebulonApp } from '../../packages/sdk-core';

const zetaApp: ZebulonApp = {
  id: 'zeta',
  name: 'Zeta',
  routes: (router, ctx) => {
    // TODO: Add Zeta routes here
  },
  ui: {
    admin: '/admin/zeta',
    user: '/app/zeta'
  },
  permissions: ['zeta:use']
};

export default zetaApp;
