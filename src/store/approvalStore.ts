import { create } from 'zustand';
import type { Ticket } from '../types/api';
import { useAuthStore } from './authStore';

interface ApprovalState {
    tickets: Ticket[];
    status: 'idle' | 'loading' | 'success' | 'error';
}

interface ApprovalActions {
    fetchApprovalTickets: () => Promise<void>;
}

type ApprovalStore = ApprovalState & {
    actions: ApprovalActions;
};

const API_BASE_URL = '/api/e-memo-job-reservation';

const getDepartmentIdByName = async (name: string): Promise<number | null> => {
    try {
        const response = await fetch(`${API_BASE_URL}/departments?name=${encodeURIComponent(name)}`);
        if (!response.ok) return null;
        const { data } = await response.json();
        return data?.[0]?.id || null;
    } catch (error) {
        console.error(`Failed to get ID for department: ${name}`, error);
        return null;
    }
};

export const useApprovalStore = create<ApprovalStore>((set) => ({
    tickets: [],
    status: 'idle',

    actions: {
        fetchApprovalTickets: async () => {
            set({ status: 'loading' });

            const { user } = useAuthStore.getState();
            const accessToken = useAuthStore.getState().accessToken;

            if (!user || !user.employee_department) {
                console.warn("Approval fetch skipped: User not logged in or doesn't have a department.");
                set({ tickets: [], status: 'success' });
                return;
            }

            const userDepartmentId = await getDepartmentIdByName(user.employee_department);

            if (!userDepartmentId) {
                console.warn(`Could not find department ID for "${user.employee_department}".`);
                set({ tickets: [], status: 'error' });
                return;
            }

            const params = new URLSearchParams({
                section_id: '1',
                requestor_department_id: String(userDepartmentId),
            });

            try {
                const response = await fetch(`${API_BASE_URL}/tickets?${params.toString()}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                if (!response.ok) throw new Error('Failed to fetch approval tickets');

                const { data } = await response.json();
                set({ tickets: data, status: 'success' });
            } catch (error) {
                console.error('Error fetching approval tickets:', error);
                set({ status: 'error' });
            }
        },
    },
}));

export const useApprovalTickets = () => useApprovalStore((state) => state.tickets);
export const useApprovalStatus = () => useApprovalStore((state) => state.status);
export const useApprovalActions = () => useApprovalStore((state) => state.actions);