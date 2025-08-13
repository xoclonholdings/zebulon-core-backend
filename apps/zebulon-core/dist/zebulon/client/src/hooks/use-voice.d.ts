import { VoiceRecognitionResult } from '@/lib/types';
export declare function useVoice(): {
    isRecording: boolean;
    isProcessing: boolean;
    startRecording: () => Promise<void>;
    stopRecording: () => Promise<Blob>;
    processVoiceCommand: (audioBlob: Blob, userId: number, onResult?: (result: VoiceRecognitionResult) => void) => Promise<VoiceRecognitionResult>;
    recordAndProcess: (userId: number, onResult?: (result: VoiceRecognitionResult) => void) => Promise<void>;
};
