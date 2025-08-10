// Zync IDE App Placeholder
import { ZebulonApp } from '../../packages/sdk-core';

const zyncIdeApp: ZebulonApp = {
  id: 'zync-ide',
  name: 'Zync IDE',
  routes: (router, ctx) => {
    // TODO: Add Zync IDE routes here
  },
  ui: {
    admin: '/admin/zync-ide',
    user: '/app/zync-ide'
  },
  permissions: ['zync-ide:use']
};

export default zyncIdeApp;
