type Listener = (data: any) => void;
declare class Bus {
    private map;
    on(topic: string, fn: Listener): void;
    off(topic: string, fn: Listener): void;
    emit(topic: string, data: any): void;
}
export declare const bus: Bus;
export {};
