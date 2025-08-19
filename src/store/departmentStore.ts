import { create } from 'zustand';
import { useAuthStore } from './authStore';

export interface Department {
    id: number;
    name: string;
    receive_job: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

const NAVBAR_COLORS = [
    'bg-basic-red/20',
    'bg-basic-orange/20',
    'bg-basic-yellow/20',
    'bg-basic-green/20',
    'bg-basic-blue/20',
    'bg-basic-purple/20',
];

interface DepartmentState {
    departments: Department[];
    selectedDepartmentId: number | null;
    status: 'idle' | 'loading' | 'success' | 'error';
}

interface DepartmentActions {
    fetchDepartments: () => Promise<void>;
    setSelectedDepartment: (id: number | null) => void;
}

interface DepartmentSelectors {
    getNavbarColorClass: (departmentName?: string) => string;
    getSortedDepartments: () => Department[];
}

type DepartmentStore = DepartmentState & {
    actions: DepartmentActions;
    selectors: DepartmentSelectors;
};

const API_BASE_URL = '/api/e-memo-job-reservation';

export const useDepartmentStore = create<DepartmentStore>((set, get) => ({
    departments: [],
    selectedDepartmentId: null,
    status: 'idle',

    actions: {
        fetchDepartments: async () => {
            set({ status: 'loading' });
            const accessToken = useAuthStore.getState().accessToken;

            try {
                const response = await fetch(
                    `${API_BASE_URL}/department?receive_job=true&is_active=true`,
                    {
                        headers: {
                            Authorization: `Bearer ${accessToken}`,
                        },
                    }
                );

                if (!response.ok) throw new Error('Failed to fetch departments');

                const { data } = await response.json();
                const sortedData = [...data].sort((a, b) => a.name.localeCompare(b.name));

                set({ departments: sortedData, status: 'success' });

                if (sortedData.length > 0 && get().selectedDepartmentId === null) {
                    set({ selectedDepartmentId: sortedData[0].id });
                }

            } catch (error) {
                console.error('Error fetching departments:', error);
                set({ status: 'error' });
            }
        },
        setSelectedDepartment: (id) => {
            set({ selectedDepartmentId: id });
        },
    },

    selectors: {
        getNavbarColorClass: (departmentName) => {
            const sortedDepartments = get().departments;
            if (!departmentName || sortedDepartments.length === 0) {
                return 'bg-blue-mtm-100';
            }

            const index = sortedDepartments.findIndex(
                (dep) => dep.name.toUpperCase() === departmentName.toUpperCase()
            );

            if (index === -1) {
                return 'bg-blue-mtm-100';
            }

            return NAVBAR_COLORS[index % NAVBAR_COLORS.length];
        },
        getSortedDepartments: () => {
            return get().departments;
        },
    },
}));

export const useDepartments = () => useDepartmentStore((state) => state.departments);
export const useSelectedDepartmentId = () => useDepartmentStore((state) => state.selectedDepartmentId);
export const useDepartmentStatus = () => useDepartmentStore((state) => state.status);
export const useDepartmentActions = () => useDepartmentStore((state) => state.actions);
export const useDepartmentSelectors = () => useDepartmentStore((state) => state.selectors);