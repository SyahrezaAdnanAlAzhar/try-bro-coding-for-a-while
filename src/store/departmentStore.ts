import { create } from 'zustand';
import type { Department } from '../types/api';
import { useLocation } from 'react-router-dom';
import { useAuthUser } from './authStore';
import { useMemo } from 'react';
import { HTTP_BASE_URL } from '../config/api';

const NAVBAR_COLORS = [
    'bg-basic-red-light',
    'bg-basic-orange-light',
    'bg-basic-yellow-light',
    'bg-basic-green-light',
    'bg-basic-blue-light',
    'bg-basic-purple-light',
];

const BADGE_COLORS = [
    'bg-basic-red',
    'bg-basic-orange',
    'bg-basic-yellow',
    'bg-basic-green',
    'bg-basic-blue',
    'bg-basic-purple',
]

interface DepartmentState {
    departments: Department[];
    selectedDepartmentId: number | null;
    status: 'idle' | 'loading' | 'success' | 'error';
}

interface DepartmentActions {
    fetchDepartments: (initialDepartmentId?: number) => Promise<void>;
    setSelectedDepartment: (id: number | null) => void;
}

interface DepartmentSelectors {
    getNavbarColorClass: (departmentName?: string) => string;
    getBadgeColorClass: (departmentName?: string) => string;
    getSortedDepartments: () => Department[];
}

type DepartmentStore = DepartmentState & {
    actions: DepartmentActions;
    selectors: DepartmentSelectors;
};

export const useDepartmentStore = create<DepartmentStore>((set, get) => ({
    departments: [],
    selectedDepartmentId: null,
    status: 'idle',

    actions: {
        fetchDepartments: async (initialDepartmentId) => {
            set({ status: 'loading' });

            try {
                const response = await fetch(
                    `${HTTP_BASE_URL}/departments?receive_job=true&is_active=true`,
                );

                if (!response.ok) throw new Error('Failed to fetch departments');

                const { data } = await response.json();
                const sortedData = [...data].sort((a, b) => a.name.localeCompare(b.name));

                set({ departments: sortedData, status: 'success' });

                let defaultId: number | null = null;
                if (initialDepartmentId && sortedData.some(d => d.id === initialDepartmentId)) {
                    defaultId = initialDepartmentId;
                } else if (sortedData.length > 0) {
                    defaultId = sortedData[0].id;
                }

                set({ selectedDepartmentId: defaultId });

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
        getBadgeColorClass: (departmentName) => {
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

            return BADGE_COLORS[index % NAVBAR_COLORS.length];
        },
        getSortedDepartments: () => {
            return get().departments;
        },
    },
}));

export const useNavbarColor = () => {
    const location = useLocation();
    const user = useAuthUser();
    const departments = useDepartments();
    const selectedDepartmentId = useSelectedDepartmentId();
    const { getNavbarColorClass } = useDepartmentSelectors();

    return useMemo(() => {
        if (location.pathname.startsWith('/job') && user) {
            return getNavbarColorClass(user.employee_department);
        }
        if (location.pathname === '/' && selectedDepartmentId) {
            const selectedDept = departments.find(d => d.id === selectedDepartmentId);
            return getNavbarColorClass(selectedDept?.name);
        }
        return 'bg-blue-mtm-100';
    }, [location.pathname, user, selectedDepartmentId, departments, getNavbarColorClass]);
};

export const useDepartments = () => useDepartmentStore((state) => state.departments);
export const useSelectedDepartmentId = () => useDepartmentStore((state) => state.selectedDepartmentId);
export const useDepartmentStatus = () => useDepartmentStore((state) => state.status);
export const useDepartmentActions = () => useDepartmentStore((state) => state.actions);
export const useDepartmentSelectors = () => useDepartmentStore((state) => state.selectors);