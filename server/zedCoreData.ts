// Core data store for Zed, to be set up during user onboarding
export interface ZedCoreData {
  userName?: string;
  preferences?: Record<string, any>;
  onboardingComplete?: boolean;
  [key: string]: any;
}
// In-memory store for user data
let coreData: ZedCoreData = {};

export function setZedCoreData(data: ZedCoreData) {
  coreData = { ...coreData, ...data };
}

export function getZedCoreData(): ZedCoreData {
  return coreData;
}
