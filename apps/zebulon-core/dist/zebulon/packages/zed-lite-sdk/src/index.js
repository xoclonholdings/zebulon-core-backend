"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ask = ask;
exports.summarize = summarize;
exports.suggestNextStep = suggestNextStep;
exports.useZedLite = useZedLite;
async function ask(prompt) { throw new Error('Not implemented'); }
async function summarize(content) { throw new Error('Not implemented'); }
async function suggestNextStep(ctx) { throw new Error('Not implemented'); }
function useZedLite() { return { ask, summarize, suggestNextStep }; }
