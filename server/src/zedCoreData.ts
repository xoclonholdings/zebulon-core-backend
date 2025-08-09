export {};
export interface ZedCoreData {
	userName?: string;
	preferences?: Record<string, any>;
	onboardingComplete?: boolean;
	[key: string]: any;
}
let coreData: ZedCoreData = {};
export function setZedCoreData(data: ZedCoreData) {
	coreData = { ...coreData, ...data };
}
export function getZedCoreData(): ZedCoreData {
	return coreData;
}
