import { create } from 'zustand';
import type { Ticket } from '../types/api';
import { useAuthStore } from './authStore';

interface ApprovalState {
    tickets: Ticket[];
    status: 'idle' | 'loading' | 'success' | 'error';
}

interface ApprovalActions {
    fetchApprovalTickets: () => Promise<void>;
}

type ApprovalStore = ApprovalState & {
    actions: ApprovalActions;
};

const API_BASE_URL = '/api/e-memo-job-reservation';

export const useApprovalStore = create<ApprovalStore>((set) => ({
    tickets: [],
    status: 'idle',

    actions: {
        fetchApprovalTickets: async () => {
            set({ status: 'loading' });
            const accessToken = useAuthStore.getState().accessToken;

            const params = new URLSearchParams({
                section_id: '1', 
            });

            try {
                const response = await fetch(`${API_BASE_URL}/tickets?${params.toString()}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                if (!response.ok) throw new Error('Failed to fetch approval tickets');

                const { data } = await response.json();
                set({ tickets: data, status: 'success' });
            } catch (error) {
                console.error('Error fetching approval tickets:', error);
                set({ status: 'error' });
            }
        },
    },
}));

export const useApprovalTickets = () => useApprovalStore((state) => state.tickets);
export const useApprovalStatus = () => useApprovalStore((state) => state.status);
export const useApprovalActions = () => useApprovalStore((state) => state.actions);