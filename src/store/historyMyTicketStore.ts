import { create } from 'zustand';
import type { Ticket } from '../types/api';
import { useAuthStore } from './authStore';
import { HTTP_BASE_URL } from '../config/api';

interface HistoryFilters {
    search?: string;
}

interface HistoryMyTicketState {
    tickets: Ticket[];
    status: 'idle' | 'loading' | 'success' | 'error';
    filters: HistoryFilters;
}

interface HistoryMyTicketActions {
    fetchMyHistoryTickets: () => Promise<void>;
    setFilters: (newFilters: Partial<HistoryFilters>) => void;
    reset: () => void;
    addOrUpdateMyHistoryTicket: (updatedTicket: Ticket) => void;
}

type HistoryMyTicketStore = HistoryMyTicketState & {
    actions: HistoryMyTicketActions;
};

const initialState: HistoryMyTicketState = {
    tickets: [],
    status: 'idle',
    filters: {
        search: '',
    },
};

export const useHistoryMyTicketStore = create<HistoryMyTicketStore>((set, get) => ({
    ...initialState,

    actions: {
        fetchMyHistoryTickets: async () => {
            set({ status: 'loading' });
            const { filters } = get();
            const { user } = useAuthStore.getState();

            if (!user?.employee_npk) {
                console.warn('Cannot fetch my history: user NPK not found.');
                set({ tickets: [], status: 'success' });
                return;
            }

            const params = new URLSearchParams({
                requestor: user.employee_npk,
            });

            if (filters.search) {
                params.append('search', filters.search);
            }

            try {
                const response = await fetch(`${HTTP_BASE_URL}/tickets?${params.toString()}`);
                if (!response.ok) throw new Error('Failed to fetch my history tickets');

                const { data } = await response.json();
                set({ tickets: data, status: 'success' });
            } catch (error) {
                console.error('Error fetching my history tickets:', error);
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

        addOrUpdateMyHistoryTicket: (updatedTicket) => {
            set((state) => {
                const tickets = [...state.tickets];
                const existingIndex = tickets.findIndex((t) => t.ticket_id === updatedTicket.ticket_id);
                if (existingIndex !== -1) {
                    tickets[existingIndex] = updatedTicket;
                } else {
                    tickets.push(updatedTicket);
                }
                return { tickets };
            });
        },
    },
}));

export const useHistoryMyTickets = () => useHistoryMyTicketStore((state) => state.tickets);
export const useHistoryMyTicketStatus = () => useHistoryMyTicketStore((state) => state.status);
export const useHistoryMyTicketFilters = () => useHistoryMyTicketStore((state) => state.filters);
export const useHistoryMyTicketActions = () => useHistoryMyTicketStore((state) => state.actions);