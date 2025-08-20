import { create } from 'zustand';

export interface TicketStatus {
    id: number;
    name: string;
    sequence: number;
    is_active: boolean;
    section_id: number;
    hex_color: string;
}

interface StatusState {
    statuses: TicketStatus[];
    statusMap: Map<number, TicketStatus>;
    status: 'idle' | 'loading' | 'success' | 'error';
}

interface StatusActions {
    fetchStatuses: () => Promise<void>;
}

interface StatusSelectors {
    getStatusById: (id: number) => TicketStatus | undefined;
    getTextColorForStatus: (id: number) => 'text-mono-white';
}

type StatusStore = StatusState & {
    actions: StatusActions;
    selectors: StatusSelectors;
};

const API_BASE_URL = '/api/e-memo-job-reservation';

export const useStatusStore = create<StatusStore>((set, get) => ({
    statuses: [],
    statusMap: new Map(),
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

                set({ statuses: data, statusMap, status: 'success' });
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
        getTextColorForStatus: (_id) => {
            return 'text-mono-white';
        },
    },
}));

export const useStatusActions = () => useStatusStore((state) => state.actions);
export const useStatusSelectors = () => useStatusStore((state) => state.selectors);