// Core data store for Zed, to be set up during user onboarding
export interface ZedCoreData {
  userName?: string;
  preferences?: Record<string, any>;
  onboardingComplete?: boolean;
  [key: string]: any;
}

// In-memory store for demo; replace with DB or persistent store in production
let coreData: ZedCoreData = {};

export function setZedCoreData(data: ZedCoreData) {
  coreData = { ...coreData, ...data };
}

export function getZedCoreData(): ZedCoreData {
  return coreData;
}
