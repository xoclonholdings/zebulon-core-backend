// Zlab App Placeholder
import { ZebulonApp } from '../../packages/sdk-core.js';

const zlabApp: ZebulonApp = {
  id: 'zlab',
  name: 'Zlab',
  routes: (router: any, ctx: any) => {
    // TODO: Add Zlab routes here
  },
  ui: {
    admin: '/admin/zlab',
    user: '/app/zlab'
  },
  permissions: ['zlab:use']
};

export default zlabApp;
