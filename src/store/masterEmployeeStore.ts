import { create } from 'zustand';
import { useAuthStore } from './authStore';
import type { Employee, EmployeeOption } from '../types/api';
import { apiClient } from '../lib/apiClient';
import { HTTP_BASE_URL } from '../config/api';

interface EmployeeFilters {
    name?: string;
    npk?: string;
    department_id?: number | null;
    area_id?: number | null;
    employee_position_id?: number | null;
    is_active?: boolean | null;
}

interface PaginationState {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
}


interface EmployeeFormOptions {
    positions: EmployeeOption[];
    departments: EmployeeOption[];
    areas: EmployeeOption[];
}

interface MasterEmployeeState {
    employees: Employee[];
    options: EmployeeFormOptions;
    status: 'idle' | 'loading' | 'error';
    pagination: PaginationState;
    filters: EmployeeFilters;
}

interface MasterEmployeeActions {
    fetchEmployees: () => Promise<void>;
    fetchOptions: () => Promise<void>;
    fetchAreasForDepartment: (departmentId: number) => Promise<void>;
    createEmployee: (payload: any) => Promise<boolean>;
    updateEmployee: (npk: string, payload: any) => Promise<boolean>;
    updateEmployeeStatus: (npk: string, isActive: boolean) => Promise<boolean>;
    setPage: (page: number) => void;
    setFilters: (newFilters: Partial<EmployeeFilters>) => void;
    reset: () => void;
}

type MasterEmployeeStore = MasterEmployeeState & {
    actions: MasterEmployeeActions;
};

const initialPagination: PaginationState = {
    currentPage: 1,
    totalPages: 1,
    pageSize: 10,
    totalItems: 0,
};

const initialFilters: EmployeeFilters = {
    name: '',
    npk: '',
    department_id: null,
    area_id: null,
    employee_position_id: null,
    is_active: null,
};

const initialState: Omit<MasterEmployeeState, 'actions'> = {
    employees: [],
    options: { positions: [], departments: [], areas: [] },
    status: 'idle',
    pagination: initialPagination,
    filters: initialFilters,
};

export const useMasterEmployeeStore = create<MasterEmployeeStore>((set, get) => ({
    ...initialState,

    actions: {
        fetchEmployees: async () => {
            set({ status: 'loading' });
            const { pagination, filters } = get();

            const params = new URLSearchParams({
                page: String(pagination.currentPage),
                limit: String(pagination.pageSize),
            });

            Object.entries(filters).forEach(([key, value]) => {
                if (value !== null && value !== '') {
                    params.append(key, String(value));
                }
            });

            try {
                const response = await apiClient(`/api/e-memo-job-reservation/employee?${params.toString()}`);
                if (!response.ok) throw new Error('Failed to fetch employees');

                const { data } = await response.json();
                set({
                    employees: data.data,
                    pagination: {
                        currentPage: data.pagination.current_page,
                        totalPages: data.pagination.total_pages,
                        pageSize: data.pagination.page_size,
                        totalItems: data.pagination.total_items,
                    },
                    status: 'idle',
                });
            } catch (error) {
                console.error(error);
                set({ status: 'error' });
            }
        },

        fetchOptions: async () => {
            const accessToken = useAuthStore.getState().accessToken;
            const headers = { Authorization: `Bearer ${accessToken}` };
            try {
                const [posRes, deptRes] = await Promise.all([
                    apiClient(`${HTTP_BASE_URL}/employee-positions`, { headers }),
                    apiClient(`${HTTP_BASE_URL}/departments`, { headers }),
                ]);
                if (!posRes.ok || !deptRes.ok) throw new Error('Failed to fetch form options');
                const positions = (await posRes.json()).data;
                const departments = (await deptRes.json()).data;
                set(state => ({ options: { ...state.options, positions, departments } }));
            } catch (error) {
                console.error(error);
            }
        },

        fetchAreasForDepartment: async (departmentId) => {
            const accessToken = useAuthStore.getState().accessToken;
            try {
                const response = await apiClient(`${HTTP_BASE_URL}/areas?department_id=${departmentId}`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                if (!response.ok) throw new Error('Failed to fetch areas');
                const { data } = await response.json();
                set(state => ({ options: { ...state.options, areas: data } }));
            } catch (error) {
                console.error(error);
            }
        },

        createEmployee: async (payload) => {
            const accessToken = useAuthStore.getState().accessToken;
            try {
                const response = await apiClient(`${HTTP_BASE_URL}/employee`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
                    body: JSON.stringify(payload),
                });
                if (!response.ok) throw new Error('Failed to create employee');
                await get().actions.fetchEmployees();
                return true;
            } catch (error) {
                console.error(error);
                return false;
            }
        },

        updateEmployee: async (npk, payload) => {
            const accessToken = useAuthStore.getState().accessToken;
            try {
                const response = await apiClient(`${HTTP_BASE_URL}/employee/${npk}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
                    body: JSON.stringify(payload),
                });
                if (!response.ok) throw new Error('Failed to update employee');
                await get().actions.fetchEmployees();
                return true;
            } catch (error) {
                console.error(error);
                return false;
            }
        },

        updateEmployeeStatus: async (npk, isActive) => {
            const accessToken = useAuthStore.getState().accessToken;
            try {
                const response = await apiClient(`${HTTP_BASE_URL}/employee/${npk}/status`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
                    body: JSON.stringify({ is_active: isActive }),
                });
                if (!response.ok) throw new Error('Failed to update employee status');
                await get().actions.fetchEmployees(); // Refetch to ensure consistency
                return true;
            } catch (error) {
                console.error(error);
                return false;
            }
        },

        setPage: (page) => {
            set(state => ({ pagination: { ...state.pagination, currentPage: page } }));
            get().actions.fetchEmployees();
        },

        setFilters: (newFilters) => {
            set(state => ({
                filters: { ...state.filters, ...newFilters },
                pagination: { ...state.pagination, currentPage: 1 },
            }));
            get().actions.fetchEmployees();
        },

        reset: () => {
            set({ ...initialState, options: get().options });
        },
    },
}));

export const useMasterEmployee = () => useMasterEmployeeStore((state) => state);
export const useMasterEmployeeActions = () => useMasterEmployeeStore((state) => state.actions);