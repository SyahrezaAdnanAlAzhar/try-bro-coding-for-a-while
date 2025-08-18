import { create } from "zustand";
import type { User } from "../types/api";
import { createJSONStorage, persist } from "zustand/middleware";

export interface AuthState {
    accessToken: string | null;
    refreshToken: string | null;
    user: User | null;
    status: 'idle' | 'loading' | 'authenticated' | 'unauthenticated';
}

export interface AuthActions {
    login: (username: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    refreshToken: () => Promise<string | null>; 
    requestWsTicket: () => Promise<string | null>;
}

export type AuthStore = AuthState & {
    actions: AuthActions;
};

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            accessToken: null,
            refreshToken: null,
            user: null,
            status: 'idle',
            actions: {
                login: async (username, password) => {
                    // POSTPONE: Implement API call to POST /login
                    console.log(username, password);
                    return false;
                },
                logout: async () => {
                    // POSTPONE: Implement API call to POST /logout and clear state
                },
                refreshToken: async () => {
                    // POSTPONE: Implement API call to POST /refresh
                    return null;
                },
                requestWsTicket: async () => {
                    // POSTPONE: Implement API call to POST /auth/ws-ticket
                    return null;
                },
            },
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
                user: state.user,
                status: state.status,
            }),
        }
    )
);

export const useAuthActions = () => useAuthStore((state) => state.actions);
export const useAuthUser = () => useAuthStore((state) => state.user);
export const useAuthStatus = () => useAuthStore((state) => state.status);