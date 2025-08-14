"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vite_1 = require("vite");
var plugin_react_1 = require("@vitejs/plugin-react");
var path_1 = require("path");
exports.default = (0, vite_1.defineConfig)({
    plugins: [(0, plugin_react_1.default)({ jsxRuntime: 'automatic' })],
    resolve: {
        alias: {
            '@': path_1.default.resolve(__dirname, 'src'),
            '@shared': path_1.default.resolve(__dirname, '../shared'),
            '@assets': path_1.default.resolve(__dirname, 'src/assets'),
        },
    },
    build: {
        target: 'esnext',
    },
    server: {
        port: 5173,
        proxy: {
            '/api': {
                target: "http://localhost:".concat(process.env.PORT || 3001),
                changeOrigin: true,
                secure: false,
            },
        },
    },
});
