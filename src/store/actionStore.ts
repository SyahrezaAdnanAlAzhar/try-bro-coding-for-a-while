import { create } from 'zustand';

export interface Action {
    id: number;
    name: string;
    is_active: boolean;
    hex_code: string;
}

interface ActionState {
    actionList: Action[];
    actionMap: Map<string, Action>;
    status: 'idle' | 'loading' | 'success' | 'error';
}

interface ActionActions {
    fetchActions: () => Promise<void>;
}

interface ActionSelectors {
    getActionByName: (name: string) => Action | undefined;
}

type ActionStore = ActionState & {
    actions: ActionActions;
    selectors: ActionSelectors;
};

const API_BASE_URL = '/api/e-memo-job-reservation';

export const useActionStore = create<ActionStore>((set, get) => ({
    actionList: [],
    actionMap: new Map(),
    status: 'idle',

    actions: {
        fetchActions: async () => {
            if (get().status !== 'idle') return;
            set({ status: 'loading' });

            try {
                const response = await fetch(`${API_BASE_URL}/actions`);
                if (!response.ok) throw new Error('Failed to fetch actions');

                const { data }: { data: Action[] } = await response.json();
                const actionMap = new Map(data.map((action) => [action.name.toUpperCase(), action]));

                set({ actionList: data, actionMap, status: 'success' });
            } catch (error) {
                console.error('Error fetching actions:', error);
                set({ status: 'error' });
            }
        },
    },

    selectors: {
        getActionByName: (name) => {
            return get().actionMap.get(name.toUpperCase());
        },
    },
}));

export const useActionActions = () => useActionStore((state) => state.actions);
export const useActionSelectors = () => useActionStore((state) => state.selectors);