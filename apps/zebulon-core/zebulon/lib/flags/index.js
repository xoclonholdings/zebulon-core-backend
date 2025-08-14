"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FLAGS = void 0;
exports.isFlagOn = isFlagOn;
exports.setFlag = setFlag;
// Shared feature flags lib
var FLAGS = {};
exports.FLAGS = FLAGS;
function isFlagOn(flag) {
    return FLAGS[flag] === true;
}
function setFlag(flag, value) {
    FLAGS[flag] = value;
}
