"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZedAppRouter = void 0;
const express_1 = __importDefault(require("express"));
const chat_1 = __importDefault(require("./routes/chat"));
const ZedAppRouter = express_1.default.Router();
exports.ZedAppRouter = ZedAppRouter;
ZedAppRouter.use('/', chat_1.default);
ZedAppRouter.get('/health', (req, res) => res.json({ status: 'ok' }));
ZedAppRouter.get('/version', (req, res) => res.json({ version: '1.0.0' }));
