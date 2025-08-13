"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setZedCoreData = setZedCoreData;
exports.getZedCoreData = getZedCoreData;
// In-memory store for user data
let coreData = {};
function setZedCoreData(data) {
    coreData = { ...coreData, ...data };
}
function getZedCoreData() {
    return coreData;
}
