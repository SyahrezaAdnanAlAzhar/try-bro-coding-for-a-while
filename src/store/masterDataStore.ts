import { create } from "zustand";
import { HTTP_BASE_URL } from "../config/api";
import { useAuthStore } from "./authStore";

export interface MasterDepartment {
    id: number;
    name: string;
    receive_job: boolean;
    is_active: boolean;
}

export interface MasterArea {
    id: number;
    department_id: number;
    name: string;
    is_active: boolean;
}

interface MasterDataState {
    departments: MasterDepartment[];
    areas: MasterArea[];
    status: 'idle' | 'loading' | 'error';
}

interface MasterDataActions {
    fetchDepartments: () => Promise<void>;
    fetchAreas: (departmentId: number) => Promise<void>;
    createDepartment: (name: string) => Promise<boolean>;
    updateDepartment: (id: number, payload: Partial<Omit<MasterDepartment, 'id'>>) => Promise<boolean>;
    createArea: (departmentId: number, name: string) => Promise<boolean>;
    updateArea: (id: number, payload: Partial<Omit<MasterArea, 'id'>>) => Promise<boolean>;
    reset: () => void;
}

type MasterDataStore = MasterDataState & {
    actions: MasterDataActions;
};

const initialState: MasterDataState = {
    departments: [],
    areas: [],
    status: 'idle',
};

export const useMasterDataStore = create<MasterDataStore>((set, get) => ({
    ...initialState,

    actions: {
        fetchDepartments: async () => {
            set({ status: 'loading' });
            const accessToken = useAuthStore.getState().accessToken;
            try {
                const response = await fetch(`${HTTP_BASE_URL}/department`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                if (!response.ok) throw new Error('Failed to fetch departments');
                const { data } = await response.json();
                set({ departments: data, status: 'idle' });
            } catch (error) {
                console.error(error);
                set({ status: 'error' });
            }
        },

        fetchAreas: async (departmentId) => {
            set({ status: 'loading' });
            try {
                const response = await fetch(`${HTTP_BASE_URL}/areas?department_id=${departmentId}`);
                if (!response.ok) throw new Error('Failed to fetch areas');
                const { data } = await response.json();
                set({ areas: data, status: 'idle' });
            } catch (error) {
                console.error(error);
                set({ status: 'error' });
            }
        },

        createDepartment: async (name) => {
            const accessToken = useAuthStore.getState().accessToken;
            try {
                const response = await fetch(`${HTTP_BASE_URL}/department`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
                    body: JSON.stringify({ name, receive_job: false }),
                });
                if (!response.ok) throw new Error('Failed to create department');
                await get().actions.fetchDepartments();
                return true;
            } catch (error) {
                console.error(error);
                return false;
            }
        },

        updateDepartment: async (id, payload) => {
            const accessToken = useAuthStore.getState().accessToken;
            try {
                const response = await fetch(`${HTTP_BASE_URL}/department/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
                    body: JSON.stringify(payload),
                });
                if (!response.ok) throw new Error('Failed to update department');
                await get().actions.fetchDepartments();
                return true;
            } catch (error) {
                console.error(error);
                return false;
            }
        },

        createArea: async (departmentId, name) => {
            const accessToken = useAuthStore.getState().accessToken;
            try {
                const response = await fetch(`${HTTP_BASE_URL}/area`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
                    body: JSON.stringify({ department_id: departmentId, name }),
                });
                if (!response.ok) throw new Error('Failed to create area');
                await get().actions.fetchAreas(departmentId);
                return true;
            } catch (error) {
                console.error(error);
                return false;
            }
        },

        updateArea: async (id, payload) => {
            const accessToken = useAuthStore.getState().accessToken;
            try {
                const response = await fetch(`${HTTP_BASE_URL}/area/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
                    body: JSON.stringify(payload),
                });
                if (!response.ok) throw new Error('Failed to update area');
                if ('department_id' in payload && payload.department_id) {
                    await get().actions.fetchAreas(payload.department_id);
                }
                return true;
            } catch (error) {
                console.error(error);
                return false;
            }
        },

        reset: () => {
            set(initialState);
        },
    },
}));

export const useMasterData = () => useMasterDataStore((state) => state);
export const useMasterDataActions = () => useMasterDataStore((state) => state.actions);