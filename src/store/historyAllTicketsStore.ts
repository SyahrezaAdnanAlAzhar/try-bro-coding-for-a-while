import { create } from 'zustand';
import type { Ticket } from '../types/api';
import { HTTP_BASE_URL } from '../config/api';

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
    addOrUpdateHistoryTicket: (updatedTicket: Ticket) => void;
}

type HistoryAllTicketStore = HistoryAllTicketState & {
    actions: HistoryAllTicketActions;
};

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
                const response = await fetch(`${HTTP_BASE_URL}/tickets?${params.toString()}`);
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

        addOrUpdateHistoryTicket: (updatedTicket) => {
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

export const useHistoryAllTickets = () => useHistoryAllTicketStore((state) => state.tickets);
export const useHistoryAllTicketStatus = () => useHistoryAllTicketStore((state) => state.status);
export const useHistoryAllTicketFilters = () => useHistoryAllTicketStore((state) => state.filters);
export const useHistoryAllTicketActions = () => useHistoryAllTicketStore((state) => state.actions);