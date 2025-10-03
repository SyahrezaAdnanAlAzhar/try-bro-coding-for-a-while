import { create } from "zustand";
import type { User } from "../types/api";
import { createJSONStorage, persist } from "zustand/middleware";
import { useApprovalStore } from "./approvalStore";
import { useCreateTicketStore } from "./createTicketStore";
import { useJobStore } from "./jobStore";
import { useRealtimeStore } from "./realtimeStore";
import { useTicketSummaryStore } from "./ticketSummaryStore";
import { useTicketTableStore } from "./ticketTableStore";
import { useHistoryAllTicketStore } from "./historyAllTicketsStore";
import { useHistoryMyTicketStore } from "./historyMyTicketStore";
import { HTTP_BASE_URL } from "../config/api";
import { apiClient } from "../lib/apiClient";

export interface AuthState {
    accessToken: string | null;
    refreshToken: string | null;
    user: User | null;
    status: 'idle' | 'loading' | 'authenticated' | 'unauthenticated';
}

export interface AuthActions {
    login: (username: string, password: string) => Promise<{ success: boolean; message?: string }>;
    logout: () => Promise<void>;
    refreshToken: () => Promise<string | null>;
    requestWsTicket: () => Promise<string | null>;
    requestPublicWsTicket: () => Promise<string | null>;
    _setTokens: (tokens: { accessToken: string; refreshToken: string }) => void;
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
                    set({ status: 'loading' });
                    try {
                        const response = await apiClient(`${HTTP_BASE_URL}/login`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ username, password }),
                        });

                        if (!response.ok) {
                            const errorData = await response.json().catch(() => null);
                            const errorMessage = errorData?.status?.message || 'An unknown error occurred.';
                            console.error('Login failed:', errorMessage);
                            set({ status: 'unauthenticated', accessToken: null, refreshToken: null, user: null });
                            return { success: false, message: errorMessage };
                        }

                        const { data } = await response.json();
                        set({
                            accessToken: data.access_token,
                            refreshToken: data.refresh_token,
                            user: data.user,
                            status: 'authenticated',
                        });
                        return { success: true };
                    } catch (error) {
                        console.error('Network or parsing error during login:', error);
                        set({ status: 'unauthenticated', accessToken: null, refreshToken: null, user: null });
                        return { success: false, message: 'Could not connect to the server.' };
                    }
                },

                logout: async () => {
                    const { accessToken } = get();
                    if (accessToken) {
                        try {
                            await apiClient(`${HTTP_BASE_URL}/logout`, {
                                method: 'POST',
                            });
                        } catch (error) {
                            console.error('Logout API call failed, but proceeding with local logout:', error);
                        }
                    }

                    set({ accessToken: null, refreshToken: null, user: null, status: 'unauthenticated' });
                    useApprovalStore.getState().actions.reset();
                    useCreateTicketStore.getState().actions.reset();
                    useHistoryAllTicketStore.getState().actions.reset();
                    useHistoryMyTicketStore.getState().actions.reset();
                    useJobStore.getState().actions.reset();
                    useRealtimeStore.getState().actions.reset();
                    useTicketSummaryStore.getState().actions.reset();
                    useTicketTableStore.getState().actions.reset();
                },

                refreshToken: async () => {
                    const { refreshToken } = get();
                    if (!refreshToken) {
                        set({ status: 'unauthenticated' });
                        return null;
                    }

                    try {
                        const response = await apiClient(`${HTTP_BASE_URL}/refresh`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ refresh_token: refreshToken }),
                        });

                        if (!response.ok) {
                            get().actions.logout();
                            return null;
                        }

                        const { data } = await response.json();
                        set({
                            accessToken: data.access_token,
                            refreshToken: data.refresh_token,
                            user: data.user,
                            status: 'authenticated',
                        });
                        return data.access_token;
                    } catch (error) {
                        console.error('Network error during token refresh:', error);
                        get().actions.logout();
                        return null;
                    }
                },

                requestWsTicket: async () => {
                    const { accessToken } = get();
                    if (!accessToken) {
                        console.error('Cannot request WebSocket ticket without an access token.');
                        return null;
                    }

                    try {
                        const response = await apiClient(`${HTTP_BASE_URL}/auth/ws-ticket`, {
                            method: 'POST',
                        });

                        if (!response.ok) {
                            if (response.status === 401) {
                                const newAccessToken = await get().actions.refreshToken();
                                if (newAccessToken) {
                                    return await get().actions.requestWsTicket();
                                }
                            }
                            throw new Error(`Failed to get WebSocket ticket: ${response.statusText}`);
                        }

                        const { data } = await response.json();
                        return data.ticket;
                    } catch (error) {
                        console.error('Error requesting WebSocket ticket:', error);
                        return null;
                    }
                },

                requestPublicWsTicket: async () => {
                    try {
                        const response = await apiClient(`${HTTP_BASE_URL}/auth/ws-public-ticket`, {
                            method: 'POST',
                        });
                        if (!response.ok) throw new Error('Failed to get public WebSocket ticket');
                        const { data } = await response.json();
                        return data.ticket;
                    } catch (error) {
                        console.error('Error requesting public WebSocket ticket:', error);
                        return null;
                    }
                },

                _setTokens: ({ accessToken, refreshToken }) => {
                    set({ accessToken, refreshToken });
                }
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