import { create } from 'zustand';
import { HTTP_BASE_URL } from '../config/api';
import { apiClient } from '../lib/apiClient';

export interface TicketSummaryItem {
    status_id: number;
    status_name: string;
    hex_code: string;
    total: number;
}

interface TicketSummaryFilters {
    month: number | null;
    year: number | null;
}

interface TicketSummaryState {
    summaryData: TicketSummaryItem[];
    oldestYear: number | null;
    filters: TicketSummaryFilters;
    status: 'idle' | 'loading' | 'success' | 'error';
}

interface TicketSummaryActions {
    fetchOldestYear: () => Promise<void>;
    fetchSummaryData: (params: { departmentId: number | null }) => Promise<void>;
    setFilter: (newFilters: Partial<TicketSummaryFilters>) => void;
    reset: () => void;
}

type TicketSummaryStore = TicketSummaryState & {
    actions: TicketSummaryActions;
};

const initialState: TicketSummaryState = {
    summaryData: [],
    oldestYear: null,
    filters: {
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
    },
    status: 'idle',
};

export const useTicketSummaryStore = create<TicketSummaryStore>((set, get) => ({
    ...initialState,

    actions: {
        fetchOldestYear: async () => {
            try {
                const response = await apiClient(`${HTTP_BASE_URL}/reports/oldest-ticket`);
                if (!response.ok) throw new Error('Failed to fetch oldest ticket year');
                const { data } = await response.json();
                const year = new Date(data.created_at).getFullYear();
                set({ oldestYear: year });
            } catch (error) {
                console.error('Error fetching oldest year:', error);
                set({ oldestYear: new Date().getFullYear() });
            }
        },

        fetchSummaryData: async ({ departmentId }) => {
            if (departmentId === null) {
                set({ summaryData: [], status: 'idle' });
                return;
            }

            set({ status: 'loading' });
            const { filters } = get();

            const params = new URLSearchParams({
                section_id: '2',
                department_id: String(departmentId),
            });

            if (filters.year) {
                params.append('year', String(filters.year));
            }
            if (filters.month) {
                params.append('month', String(filters.month));
            }

            try {
                const response = await apiClient(`${HTTP_BASE_URL}/reports/ticket-summary?${params.toString()}`);

                if (!response.ok) throw new Error('Failed to fetch ticket summary');

                const { data } = await response.json();
                const sortedData = [...data].sort((a, b) => a.status_id - b.status_id);
                set({ summaryData: sortedData, status: 'success' });
            } catch (error) {
                console.error('Error fetching ticket summary:', error);
                set({ status: 'error' });
            }
        },

        setFilter: (newFilters) => {
            set((state) => ({
                filters: { ...state.filters, ...newFilters },
            }));
        },

        reset: () => {
            initialState
        }
    },
}));

export const useTicketSummary = () => useTicketSummaryStore((state) => state.summaryData);
export const useTicketSummaryFilters = () => useTicketSummaryStore((state) => state.filters);
export const useOldestYear = () => useTicketSummaryStore((state) => state.oldestYear);
export const useTicketSummaryStatus = () => useTicketSummaryStore((state) => state.status);
export const useTicketSummaryActions = () => useTicketSummaryStore((state) => state.actions);