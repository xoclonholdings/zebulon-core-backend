"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var zlabApp = {
    id: 'zlab',
    name: 'Zlab',
    routes: function (router, ctx) {
        // TODO: Add Zlab routes here
    },
    ui: {
        admin: '/admin/zlab',
        user: '/app/zlab'
    },
    permissions: ['zlab:use']
};
exports.default = zlabApp;
