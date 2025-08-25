import { create } from 'zustand';
import type { Ticket } from '../types/api';

interface TicketTableFilters {
    search?: string;
}

interface TicketTableSort {
    by: string;
    direction: 'asc' | 'desc';
}

interface TicketTableState {
    tickets: Ticket[];
    status: 'idle' | 'loading' | 'success' | 'error';
    filters: TicketTableFilters;
    sort: TicketTableSort;
}

interface TicketTableActions {
    fetchTickets: (params: { departmentId: number }) => Promise<void>;
    setFilters: (newFilters: Partial<TicketTableFilters>) => void;
    setSort: (newSort: TicketTableSort) => void;
    reset: () => void;
}

type TicketTableStore = TicketTableState & {
    actions: TicketTableActions;
};

const API_BASE_URL = '/api/e-memo-job-reservation';

const initialState: TicketTableState = {
    tickets: [],
    status: 'idle',
    filters: {
        search: '',
    },
    sort: {
        by: 'priority',
        direction: 'asc',
    },
}

export const useTicketTableStore = create<TicketTableStore>((set, get) => ({
    ...initialState,

    actions: {
        fetchTickets: async ({ departmentId }) => {
            set({ status: 'loading' });
            const { filters, sort } = get();

            const params = new URLSearchParams({
                section_id: '2',
                department_target_id: String(departmentId),
                sort_by: `${sort.by}_${sort.direction}`,
            });

            if (filters.search) {
                params.append('search', filters.search);
            }

            try {
                const response = await fetch(`${API_BASE_URL}/tickets?${params.toString()}`);
                if (!response.ok) throw new Error('Failed to fetch tickets');

                const { data } = await response.json();
                set({ tickets: data, status: 'success' });
            } catch (error) {
                console.error('Error fetching tickets:', error);
                set({ status: 'error' });
            }
        },

        setFilters: (newFilters) => {
            set((state) => ({
                filters: { ...state.filters, ...newFilters },
            }));
        },

        setSort: (newSort) => {
            set({ sort: newSort });
        },
        reset: () => {
            initialState
        }
    },
}));

export const useTickets = () => useTicketTableStore((state) => state.tickets);
export const useTicketTableStatus = () => useTicketTableStore((state) => state.status);
export const useTicketTableFilters = () => useTicketTableStore((state) => state.filters);
export const useTicketTableSort = () => useTicketTableStore((state) => state.sort);
export const useTicketTableActions = () => useTicketTableStore((state) => state.actions);