"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setZedCoreData = setZedCoreData;
exports.getZedCoreData = getZedCoreData;
let coreData = {};
function setZedCoreData(data) {
    coreData = { ...coreData, ...data };
}
function getZedCoreData() {
    return coreData;
}
