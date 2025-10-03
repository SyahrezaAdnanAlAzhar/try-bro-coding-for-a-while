import { create } from "zustand";
import { HTTP_BASE_URL } from "../config/api";
import { apiClient } from "../lib/apiClient";

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

export interface PhysicalLocation {
    id: number;
    name: string;
    is_active: boolean;
}

export interface SpecifiedLocation {
    id: number;
    physical_location_id: number;
    name: string;
    is_active: boolean;
}


interface MasterDataState {
    departments: MasterDepartment[];
    areas: MasterArea[];
    physicalLocations: PhysicalLocation[];
    specifiedLocations: SpecifiedLocation[];
    status: 'idle' | 'loading' | 'error';
}

interface MasterDataActions {
    fetchDepartments: () => Promise<void>;
    fetchAreas: (departmentId: number) => Promise<void>;
    createDepartment: (name: string) => Promise<boolean>;
    updateDepartment: (id: number, payload: Partial<Omit<MasterDepartment, 'id'>>) => Promise<boolean>;
    createArea: (departmentId: number, name: string) => Promise<boolean>;
    updateArea: (id: number, payload: Partial<Omit<MasterArea, 'id'>>) => Promise<boolean>;
    fetchPhysicalLocations: () => Promise<void>;
    fetchSpecifiedLocations: (physicalLocationId: number) => Promise<void>;
    createPhysicalLocation: (name: string) => Promise<boolean>;
    createSpecifiedLocation: (physicalLocationId: number, name: string) => Promise<boolean>;
    updatePhysicalLocationName: (id: number, name: string) => Promise<boolean>;
    updateSpecifiedLocationName: (id: number, physicalLocationId: number, name: string) => Promise<boolean>;
    updatePhysicalLocationStatus: (id: number, isActive: boolean) => Promise<boolean>;
    updateSpecifiedLocationStatus: (id: number, physicalLocationId: number, isActive: boolean) => Promise<boolean>;
    reset: () => void;
}

type MasterDataStore = MasterDataState & {
    actions: MasterDataActions;
};

const initialState: MasterDataState = {
    departments: [],
    areas: [],
    physicalLocations: [],
    specifiedLocations: [],
    status: 'idle',
};

export const useMasterDataStore = create<MasterDataStore>((set, get) => ({
    ...initialState,

    actions: {
        fetchDepartments: async () => {
            set({ status: 'loading' });
            try {
                const response = await apiClient(`${HTTP_BASE_URL}/departments`, {
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
                const response = await apiClient(`${HTTP_BASE_URL}/areas?department_id=${departmentId}`);
                if (!response.ok) throw new Error('Failed to fetch areas');
                const { data } = await response.json();
                set({ areas: data, status: 'idle' });
            } catch (error) {
                console.error(error);
                set({ status: 'error' });
            }
        },

        createDepartment: async (name) => {
            try {
                const response = await apiClient(`${HTTP_BASE_URL}/department`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
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
            const { departments } = get();
            const departmentToUpdate = departments.find(d => d.id === id);

            if (!departmentToUpdate) {
                console.error(`Department with id ${id} not found in store.`);
                return false;
            }

            const fullPayload = {
                ...departmentToUpdate,
                ...payload,
            };

            console.log('Sending FULL PUT /department payload:', JSON.stringify(fullPayload));

            try {
                const response = await apiClient(`${HTTP_BASE_URL}/department/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(fullPayload),
                });
                if (!response.ok) throw new Error('Failed to update department');

                set(state => ({
                    departments: state.departments.map(d => d.id === id ? fullPayload : d)
                }));

                return true;
            } catch (error) {
                console.error(error);
                return false;
            }
        },

        createArea: async (departmentId, name) => {
            try {
                const response = await apiClient(`${HTTP_BASE_URL}/area`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
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
            const { areas } = get();
            const areaToUpdate = areas.find(a => a.id === id);
            if (!areaToUpdate) return false;

            const fullPayload = { ...areaToUpdate, ...payload };

            try {
                const response = await apiClient(`${HTTP_BASE_URL}/area/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(fullPayload),
                });
                if (!response.ok) throw new Error('Failed to update area');

                set(state => ({
                    areas: state.areas.map(a => a.id === id ? fullPayload : a)
                }));

                return true;
            } catch (error) {
                console.error(error);
                return false;
            }
        },
        fetchPhysicalLocations: async () => {
            set({ status: 'loading' });
            try {
                const response = await apiClient(`${HTTP_BASE_URL}/physical-location`, {
                });
                if (!response.ok) throw new Error('Failed to fetch physical locations');
                const { data } = await response.json();
                set({ physicalLocations: data, status: 'idle' });
            } catch (error) {
                console.error(error);
                set({ status: 'error' });
            }
        },

        fetchSpecifiedLocations: async (physicalLocationId) => {
            set({ status: 'loading' });
            try {
                const response = await apiClient(`${HTTP_BASE_URL}/specified-location?physical_location_id=${physicalLocationId}`, {
                });
                if (!response.ok) throw new Error('Failed to fetch specified locations');
                const { data } = await response.json();
                set({ specifiedLocations: data, status: 'idle' });
            } catch (error) {
                console.error(error);
                set({ status: 'error' });
            }
        },

        createPhysicalLocation: async (name) => {
            try {
                const response = await apiClient(`${HTTP_BASE_URL}/physical-location`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name }),
                });
                if (!response.ok) throw new Error('Failed to create physical location');
                await get().actions.fetchPhysicalLocations();
                return true;
            } catch (error) {
                console.error(error);
                return false;
            }
        },

        createSpecifiedLocation: async (physicalLocationId, name) => {
            try {
                const response = await apiClient(`${HTTP_BASE_URL}/specified-location`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ physical_location_id: physicalLocationId, name }),
                });
                if (!response.ok) throw new Error('Failed to create specified location');
                await get().actions.fetchSpecifiedLocations(physicalLocationId);
                return true;
            } catch (error) {
                console.error(error);
                return false;
            }
        },

        updatePhysicalLocationName: async (id, name) => {
            try {
                const response = await apiClient(`${HTTP_BASE_URL}/physical-location/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name }),
                });
                if (!response.ok) throw new Error('Failed to update physical location name');
                await get().actions.fetchPhysicalLocations();
                return true;
            } catch (error) {
                console.error(error);
                return false;
            }
        },

        updateSpecifiedLocationName: async (id, physicalLocationId, name) => {
            try {
                const response = await apiClient(`${HTTP_BASE_URL}/specified-location/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ physical_location_id: physicalLocationId, name }),
                });
                if (!response.ok) throw new Error('Failed to update specified location name');
                await get().actions.fetchSpecifiedLocations(physicalLocationId);
                return true;
            } catch (error) {
                console.error(error);
                return false;
            }
        },

        updatePhysicalLocationStatus: async (id, isActive) => {
            const payload = { is_active: isActive };
            try {
                const response = await apiClient(`${HTTP_BASE_URL}/physical-location/${id}/status`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
                if (!response.ok) throw new Error('Failed to update physical location status');
                return true;
            } catch (error) {
                console.error(error);
                return false;
            }
        },

        updateSpecifiedLocationStatus: async (id, isActive) => {
            const payload = { is_active: isActive };
            try {
                const response = await apiClient(`${HTTP_BASE_URL}/specified-location/${id}/status`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                });
                if (!response.ok) throw new Error('Failed to update specified location status');
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