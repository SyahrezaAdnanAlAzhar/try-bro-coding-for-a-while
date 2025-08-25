import { create } from 'zustand';
import type { Ticket } from '../types/api';
import { useAuthStore } from './authStore';

interface JobState {
    jobs: Ticket[];
    myJobs: Ticket[];
    status: 'idle' | 'loading' | 'success' | 'error';
    myJobsStatus: 'idle' | 'loading' | 'success' | 'error';
}

interface JobActions {
    fetchJobs: () => Promise<void>;
    fetchMyJobs: () => Promise<void>;
}

type JobStore = JobState & {
    actions: JobActions;
};

const API_BASE_URL = '/api/e-memo-job-reservation';

export const useJobStore = create<JobStore>((set) => ({
    jobs: [],
    myJobs: [],
    status: 'idle',
    myJobsStatus: 'idle',

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
                assigned_department_name: user.employee_department,
            });

            try {
                const response = await fetch(`${API_BASE_URL}/jobs?${params.toString()}`, {
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
        fetchMyJobs: async () => {
            set({ myJobsStatus: 'loading' });
            const { user } = useAuthStore.getState();
            const accessToken = useAuthStore.getState().accessToken;

            if (!user || !user.employee_npk) {
                console.warn("My Jobs fetch skipped: User not logged in or doesn't have an NPK.");
                set({ myJobs: [], myJobsStatus: 'success' });
                return;
            }

            const params = new URLSearchParams({
                pic_npk: user.employee_npk,
            });

            try {
                const response = await fetch(`${API_BASE_URL}/jobs?${params.toString()}`, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                if (!response.ok) throw new Error('Failed to fetch my jobs');

                const { data } = await response.json();
                set({ myJobs: data, myJobsStatus: 'success' });
            } catch (error) {
                console.error('Error fetching my jobs:', error);
                set({ myJobsStatus: 'error' });
            }
        },
    },
}));

export const useJobs = () => useJobStore((state) => state.jobs);
export const useJobStatus = () => useJobStore((state) => state.status);
export const useMyJobs = () => useJobStore((state) => state.myJobs);
export const useMyJobsStatus = () => useJobStore((state) => state.myJobsStatus);
export const useJobActions = () => useJobStore((state) => state.actions);