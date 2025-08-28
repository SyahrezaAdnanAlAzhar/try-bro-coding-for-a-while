import { create } from 'zustand';
import type { Ticket } from '../types/api';

interface HistoryFilters {
    search?: string;
}

interface HistoryAllTicketState {
    tickets: Ticket[];
    status: 'idle' | 'loading' | 'success' | 'error';
    filters: HistoryFilters;
}

interface HistoryAllTicketActions {
    fetchHistoryTickets: (params: { departmentId: number }) => Promise<void>;
    setFilters: (newFilters: Partial<HistoryFilters>) => void;
    reset: () => void;
}

type HistoryAllTicketStore = HistoryAllTicketState & {
    actions: HistoryAllTicketActions;
};

const API_BASE_URL = '/api/e-memo-job-reservation';

const initialState: HistoryAllTicketState = {
    tickets: [],
    status: 'idle',
    filters: {
        search: '',
    },
};

export const useHistoryAllTicketStore = create<HistoryAllTicketStore>((set, get) => ({
    ...initialState,

    actions: {
        fetchHistoryTickets: async ({ departmentId }) => {
            set({ status: 'loading' });
            const { filters } = get();

            const params = new URLSearchParams({
                section_id: '3',
                department_target_id: String(departmentId),
            });

            if (filters.search) {
                params.append('search', filters.search);
            }

            try {
                const response = await fetch(`${API_BASE_URL}/tickets?${params.toString()}`);
                if (!response.ok) throw new Error('Failed to fetch history tickets');

                const { data } = await response.json();
                set({ tickets: data, status: 'success' });
            } catch (error) {
                console.error('Error fetching history tickets:', error);
                set({ status: 'error' });
            }
        },

        setFilters: (newFilters) => {
            set((state) => ({
                filters: { ...state.filters, ...newFilters },
            }));
        },

        reset: () => {
            set(initialState);
        },
    },
}));

export const useHistoryAllTickets = () => useHistoryAllTicketStore((state) => state.tickets);
export const useHistoryAllTicketStatus = () => useHistoryAllTicketStore((state) => state.status);
export const useHistoryAllTicketFilters = () => useHistoryAllTicketStore((state) => state.filters);
export const useHistoryAllTicketActions = () => useHistoryAllTicketStore((state) => state.actions);