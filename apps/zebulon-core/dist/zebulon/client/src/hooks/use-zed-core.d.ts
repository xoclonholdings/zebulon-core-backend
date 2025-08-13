export interface ZedCoreReminder {
    id: string;
    title: string;
    message: string;
    priority: 'low' | 'medium' | 'high' | 'critical';
    scheduledTime?: Date;
    recurring?: boolean;
    active: boolean;
}
export interface ZedCoreBackgroundTask {
    id: string;
    type: string;
    description: string;
    status: 'pending' | 'running' | 'completed' | 'failed';
    progress?: number;
    createdAt: Date;
    completedAt?: Date;
    data?: any;
    result?: any;
}
export interface ZedCoreStatus {
    initialized: boolean;
    backgroundOperationsEnabled: boolean;
    activeTasksCount: number;
    pendingRemindersCount: number;
    integratedAppsCount: number;
    lastActivity: Date;
}
interface UseZedCoreReturn {
    status: ZedCoreStatus | null;
    isLoading: boolean;
    createReminder: (reminder: Partial<ZedCoreReminder>) => Promise<void>;
    backgroundTasks: ZedCoreBackgroundTask[];
    createBackgroundTask: (type: string, description: string, data?: any) => Promise<string>;
    announceTaskCompletion: (taskId: string, description: string, results?: any) => Promise<void>;
    refresh: () => Promise<void>;
}
export declare const useZedCore: (userId: number) => UseZedCoreReturn;
export {};
