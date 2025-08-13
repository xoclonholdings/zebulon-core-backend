"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = mountUpdates;
const router_1 = __importDefault(require("./router"));
function mountUpdates(app) {
    app.use("/api", router_1.default);
}
