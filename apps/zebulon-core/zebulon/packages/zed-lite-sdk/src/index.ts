// Zed Lite SDK: ask, summarize, suggestNextStep, useZedLite
export type ZedLiteContext = { [key: string]: any }
export async function ask(prompt: string): Promise<string> { throw new Error('Not implemented') }
export async function summarize(content: string): Promise<string> { throw new Error('Not implemented') }
export async function suggestNextStep(ctx: ZedLiteContext): Promise<string> { throw new Error('Not implemented') }
export function useZedLite() { return { ask, summarize, suggestNextStep } }
