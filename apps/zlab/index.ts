// Zlab App Placeholder
import { ZebulonApp } from '../../packages/sdk-core';

const zlabApp: ZebulonApp = {
  id: 'zlab',
  name: 'Zlab',
  routes: (router, ctx) => {
    // TODO: Add Zlab routes here
  },
  ui: {
    admin: '/admin/zlab',
    user: '/app/zlab'
  },
  permissions: ['zlab:use']
};

export default zlabApp;
