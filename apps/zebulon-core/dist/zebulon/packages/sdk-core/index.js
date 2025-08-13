"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerApp = registerApp;
exports.getApps = getApps;
const apps = [];
function registerApp(app) {
    apps.push(app);
}
function getApps() {
    return apps;
}
