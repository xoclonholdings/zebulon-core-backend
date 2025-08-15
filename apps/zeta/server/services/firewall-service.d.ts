export declare class FirewallService {
    private threatCounters;
    detectThreat(source: string, target: string, threatType: string): Promise<boolean>;
    private getSeverityForThreatType;
    private updateThreatCounters;
    getThreatCounters(): {
        aiInjection: number;
        corporateSabotage: number;
        marketManipulation: number;
        totalBlocked: number;
    };
    updateSystemMetrics(): Promise<void>;
    verifyZwapSecurity(): Promise<boolean>;
    simulateThreatDetection(): Promise<void>;
}
export declare const firewallService: FirewallService;
