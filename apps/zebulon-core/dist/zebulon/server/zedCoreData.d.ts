export interface ZedCoreData {
    userName?: string;
    preferences?: Record<string, any>;
    onboardingComplete?: boolean;
    [key: string]: any;
}
export declare function setZedCoreData(data: ZedCoreData): void;
export declare function getZedCoreData(): ZedCoreData;
