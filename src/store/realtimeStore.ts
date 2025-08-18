import { create } from 'zustand';
import type { EditingPayload } from '../types/api';

export interface RealtimeState {
    connectionStatus: 'connected' | 'disconnected' | 'connecting';
    activeEditor: EditingPayload | null;
}

export interface RealtimeActions {
    setConnectionStatus: (status: RealtimeState['connectionStatus']) => void;
    handleEditingStarted: (payload: EditingPayload) => void;
    handleEditingFinished: (payload: EditingPayload) => void;
}

export type RealtimeStore = RealtimeState & {
    actions: RealtimeActions;
};

export const useRealtimeStore = create<RealtimeStore>((set, get) => ({
    connectionStatus: 'disconnected',
    activeEditor: null,
    actions: {
        setConnectionStatus: (status) => set({ connectionStatus: status }),
        handleEditingStarted: (payload) => {
            if (get().activeEditor?.context_id !== payload.context_id) {
                set({ activeEditor: payload });
            }
        },
        handleEditingFinished: (payload) => {
            if (get().activeEditor?.context_id === payload.context_id) {
                set({ activeEditor: null });
            }
        },
    },
}));

export const useRealtimeActions = () => useRealtimeStore((state) => state.actions);
export const useConnectionStatus = () => useRealtimeStore((state) => state.connectionStatus);
export const useActiveEditor = () => useRealtimeStore((state) => state.activeEditor);