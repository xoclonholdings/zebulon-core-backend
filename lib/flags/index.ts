// Shared feature flags lib
const FLAGS: Record<string, boolean> = {};
export function isFlagOn(flag: string): boolean {
  return FLAGS[flag] === true;
}
export function setFlag(flag: string, value: boolean) {
  FLAGS[flag] = value;
}
export { FLAGS };
