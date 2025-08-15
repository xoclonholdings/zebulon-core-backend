export declare class PerformanceCache {
    private static instance;
    private dashboardCache;
    private userCache;
    private metricsCache;
    private constructor();
    static getInstance(): PerformanceCache;
    getDashboardData(key: string): any;
    setDashboardData(key: string, data: any): void;
    getUser(key: string): any;
    setUser(key: string, user: any): void;
    getMetrics(key: string): any;
    setMetrics(key: string, metrics: any): void;
    invalidateDashboard(): void;
    invalidateUser(userId?: string): void;
    invalidateMetrics(): void;
    getStats(): {
        dashboard: {
            size: any;
            max: any;
        };
        users: {
            size: any;
            max: any;
        };
        metrics: {
            size: any;
            max: any;
        };
    };
}
export declare const cache: PerformanceCache;
