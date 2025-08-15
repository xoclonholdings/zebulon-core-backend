export declare class BadActorService {
    private quarantineProtocols;
    detectAndTrackBadActor(identifier: string, identifierType: string, threatIndicators: {
        suspiciousActivity?: boolean;
        repeatedAccess?: boolean;
        unauthorizedAttempts?: number;
        dataExfiltration?: boolean;
    }): Promise<{
        id: number;
        metadata: unknown;
        status: string;
        identifier: string;
        identifierType: string;
        threatLevel: number;
        firstDetected: Date;
        lastActivity: Date;
        attempts: number;
        countermeasures: string[];
    } | undefined>;
    private getInitialCountermeasures;
    deployDataDeprecationProtocol(badActorId: number, dataType: string, reason?: string): Promise<{
        dataType: string;
        id: number;
        status: string;
        deprecationReason: string;
        originalValue: string | null;
        newValue: string | null;
        deprecatedAt: Date;
        expiresAt: Date;
    }>;
    deployHoneypotProtocol(badActorIdentifier: string): Promise<{
        id: number;
        isActive: boolean;
        protocolName: string;
        protocolType: string;
        targetType: string;
        triggerConditions: unknown;
        response: unknown;
        effectiveness: number;
        deployedAt: Date;
    }>;
    deployDataPoisoningProtocol(badActorId: number, threatLevel: number): Promise<{
        id: number;
        isActive: boolean;
        protocolName: string;
        protocolType: string;
        targetType: string;
        triggerConditions: unknown;
        response: unknown;
        effectiveness: number;
        deployedAt: Date;
    }>;
    deployQuantumIsolationProtocol(badActorId: number): Promise<{
        id: number;
        isActive: boolean;
        protocolName: string;
        protocolType: string;
        targetType: string;
        triggerConditions: unknown;
        response: unknown;
        effectiveness: number;
        deployedAt: Date;
    }>;
    getActiveThreatMitigationStatus(): Promise<{
        totalBadActors: number;
        highThreatActors: number;
        activeProtocols: number;
        activeDeprecations: number;
        averageEffectiveness: number;
        criticalThreats: number;
    }>;
    simulateBadActorDetection(): Promise<{
        id: number;
        metadata: unknown;
        status: string;
        identifier: string;
        identifierType: string;
        threatLevel: number;
        firstDetected: Date;
        lastActivity: Date;
        attempts: number;
        countermeasures: string[];
    } | undefined>;
}
export declare const badActorService: BadActorService;
