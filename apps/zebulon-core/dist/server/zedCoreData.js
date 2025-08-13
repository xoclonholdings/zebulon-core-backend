"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setZedCoreData = setZedCoreData;
exports.getZedCoreData = getZedCoreData;
// In-memory store for demo; replace with DB or persistent store in production
let coreData = {};
function setZedCoreData(data) {
    coreData = { ...coreData, ...data };
}
function getZedCoreData() {
    return coreData;
}
