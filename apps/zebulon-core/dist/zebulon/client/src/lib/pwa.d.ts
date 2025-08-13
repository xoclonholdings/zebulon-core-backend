export interface PWAInstallPrompt {
    prompt(): Promise<void>;
    userChoice: Promise<{
        outcome: 'accepted' | 'dismissed';
    }>;
}
declare global {
    interface WindowEventMap {
        beforeinstallprompt: Event & PWAInstallPrompt;
    }
}
declare class ZebulonPWA {
    private deferredPrompt;
    private isInstalled;
    private isStandalone;
    constructor();
    private checkStandaloneMode;
    private registerServiceWorker;
    private setupInstallPrompt;
    private setupConnectionMonitoring;
    private handleServiceWorkerMessage;
    private notifyUpdate;
    private notifyConnectionStatus;
    private showInstallButton;
    private hideInstallButton;
    installApp(): Promise<boolean>;
    isAppInstallable(): boolean;
    isRunningStandalone(): boolean;
    isAppInstalled(): boolean;
    getConnectionStatus(): boolean;
    requestPersistentStorage(): Promise<boolean>;
    getStorageEstimate(): Promise<StorageEstimate | null>;
}
export declare const zebulonPWA: ZebulonPWA;
export default zebulonPWA;
