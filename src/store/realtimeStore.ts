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
    reset: () => void;
}

export type RealtimeStore = RealtimeState & {
    actions: RealtimeActions;
};

const initialState: RealtimeState = {
    connectionStatus: 'disconnected',
    activeEditor: null,
};

export const useRealtimeStore = create<RealtimeStore>((set, get) => ({
    ...initialState,
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
        reset: () => {
            set(initialState);
        },
    },
}));

export const useRealtimeActions = () => useRealtimeStore((state) => state.actions);
export const useConnectionStatus = () => useRealtimeStore((state) => state.connectionStatus);
export const useActiveEditor = () => useRealtimeStore((state) => state.activeEditor);