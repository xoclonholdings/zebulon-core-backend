"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vite_1 = require("vite");
const plugin_react_1 = __importDefault(require("@vitejs/plugin-react"));
const path_1 = __importDefault(require("path"));
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
                target: `http://localhost:${process.env.PORT || 3001}`,
                changeOrigin: true,
                secure: false,
            },
        },
    },
});
