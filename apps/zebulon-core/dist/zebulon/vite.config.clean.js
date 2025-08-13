"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vite_1 = require("vite");
const plugin_react_1 = __importDefault(require("@vitejs/plugin-react"));
const path_1 = require("path");
exports.default = (0, vite_1.defineConfig)({
    plugins: [(0, plugin_react_1.default)()],
    root: "client",
    build: {
        outDir: "../dist/public",
        emptyOutDir: true,
    },
    resolve: {
        alias: {
            "@": (0, path_1.resolve)(__dirname, "./client/src"),
            "@shared": (0, path_1.resolve)(__dirname, "./shared"),
            "@assets": (0, path_1.resolve)(__dirname, "./attached_assets"),
        },
    },
    server: {
        port: 5173,
        proxy: {
            "/api": {
                target: `http://localhost:${process.env.PORT || 3001}`,
                changeOrigin: true,
            },
        },
    },
});
