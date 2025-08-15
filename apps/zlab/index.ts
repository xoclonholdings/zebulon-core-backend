// Zlab App Placeholder
import { ZebulonApp } from '../../packages/sdk-core.js';
import { sdk } from '../../packages/sdk-core.js';

// Stub example if missing
// export const sdk = {};

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
