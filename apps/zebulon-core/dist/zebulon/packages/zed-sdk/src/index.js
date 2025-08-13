"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ask = ask;
exports.summarize = summarize;
exports.suggestNextStep = suggestNextStep;
exports.useZed = useZed;
async function ask(prompt) { throw new Error('Not implemented'); }
async function summarize(content) { throw new Error('Not implemented'); }
async function suggestNextStep(ctx) { throw new Error('Not implemented'); }
function useZed() { return { ask, summarize, suggestNextStep }; }
