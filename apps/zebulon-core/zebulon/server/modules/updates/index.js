"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = mountUpdates;
var router_1 = require("./router");
function mountUpdates(app) {
    app.use("/api", router_1.default);
}
