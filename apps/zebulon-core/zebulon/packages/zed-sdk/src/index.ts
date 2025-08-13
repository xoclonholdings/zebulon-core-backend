// Zed SDK: ask, summarize, suggestNextStep, useZed
export type ZedContext = { [key: string]: any }
export async function ask(prompt: string): Promise<string> { throw new Error('Not implemented') }
export async function summarize(content: string): Promise<string> { throw new Error('Not implemented') }
export async function suggestNextStep(ctx: ZedContext): Promise<string> { throw new Error('Not implemented') }
export function useZed() { return { ask, summarize, suggestNextStep } }
