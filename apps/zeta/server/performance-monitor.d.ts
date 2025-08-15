export declare class PerformanceMonitor {
    private static instance;
    private cleanupInterval;
    private analyticsInterval;
    private constructor();
    static getInstance(): PerformanceMonitor;
    start(): void;
    stop(): void;
    private performCleanup;
    private analyzePerformance;
    getPerformanceStats(): Promise<any>;
}
export declare const performanceMonitor: PerformanceMonitor;
