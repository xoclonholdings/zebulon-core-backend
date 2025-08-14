"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sha256 = void 0;
var crypto_1 = require("crypto");
var sha256 = function (s) { return crypto_1.default.createHash("sha256").update(s).digest("hex"); };
exports.sha256 = sha256;
