import { create } from 'zustand';
import type { Ticket } from '../types/api';
import { useAuthStore } from './authStore';

interface JobState {
    jobs: Ticket[];
    status: 'idle' | 'loading' | 'success' | 'error';
}

interface JobActions {
    fetchJobs: () => Promise<void>;
}

type JobStore = JobState & {
    actions: JobActions;
};

const API_BASE_URL = '/api/e-memo-job-reservation';

export const useJobStore = create<JobStore>((set) => ({
    jobs: [],
    status: 'idle',

    actions: {
        fetchJobs: async () => {
            set({ status: 'loading' });
            const { user } = useAuthStore.getState();
            const accessToken = useAuthStore.getState().accessToken;

            if (!user || !user.employee_department) {
                console.warn("Job fetch skipped: User not logged in or doesn't have a department.");
                set({ jobs: [], status: 'success' });
                return;
            }

            const params = new URLSearchParams({
                section_id: '2',
                department_target_name: user.employee_department,
            });

            try {
                const response = await fetch(`${API_BASE_URL}/tickets?${params.toString()}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                if (!response.ok) throw new Error('Failed to fetch jobs');

                const { data } = await response.json();
                set({ jobs: data, status: 'success' });
            } catch (error) {
                console.error('Error fetching jobs:', error);
                set({ status: 'error' });
            }
        },
    },
}));

export const useJobs = () => useJobStore((state) => state.jobs);
export const useJobStatus = () => useJobStore((state) => state.status);
export const useJobActions = () => useJobStore((state) => state.actions);