import { create } from 'zustand';
import type { TicketStatus } from '../types/api';

interface StatusState {
    statuses: TicketStatus[];
    statusMap: Map<number, TicketStatus>;
    statusNameMap: Map<string, TicketStatus>;
    status: 'idle' | 'loading' | 'success' | 'error';
}

interface StatusActions {
    fetchStatuses: () => Promise<void>;
}

interface StatusSelectors {
    getStatusById: (id: number) => TicketStatus | undefined;
    getStatusByName: (name: string) => TicketStatus | undefined;
}

type StatusStore = StatusState & {
    actions: StatusActions;
    selectors: StatusSelectors;
};

const API_BASE_URL = '/api/e-memo-job-reservation';

export const useStatusStore = create<StatusStore>((set, get) => ({
    statuses: [],
    statusMap: new Map(),
    statusNameMap: new Map(),
    status: 'idle',

    actions: {
        fetchStatuses: async () => {
            const { status } = get();
            if (status === 'loading' || status === 'success') return;
            set({ status: 'loading' });

            try {
                const response = await fetch(`${API_BASE_URL}/status-ticket`);
                if (!response.ok) throw new Error('Failed to fetch statuses');

                const { data }: { data: TicketStatus[] } = await response.json();
                const statusMap = new Map(data.map((status) => [status.id, status]));
                const statusNameMap = new Map(data.map((status) => [status.name.toUpperCase(), status]));

                set({ statuses: data, statusMap, statusNameMap, status: 'success' });
            } catch (error) {
                console.error('Error fetching statuses:', error);
                set({ status: 'error' });
            }
        },
    },

    selectors: {
        getStatusById: (id) => {
            return get().statusMap.get(id);
        },

        getStatusByName: (name) => {
            return get().statusNameMap.get(name.toUpperCase());
        }
    },
}));

export const useStatusActions = () => useStatusStore((state) => state.actions);
export const useStatusSelectors = () => useStatusStore((state) => state.selectors);