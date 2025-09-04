import { create } from 'zustand';
import type { Ticket } from '../types/api';
import { useAuthStore } from './authStore';
import { useDepartmentStore } from './departmentStore';
import { HTTP_BASE_URL } from '../config/api';

interface JobState {
    jobs: Ticket[];
    myJobs: Ticket[];
    status: 'idle' | 'loading' | 'success' | 'error';
    myJobsStatus: 'idle' | 'loading' | 'success' | 'error';
}

interface JobActions {
    fetchJobs: () => Promise<void>;
    fetchMyJobs: () => Promise<void>;
    reset: () => void;
    reorderJobs: (sourceIndex: number, destinationIndex: number) => void;
    saveJobOrder: () => Promise<boolean>;
}

type JobStore = JobState & {
    actions: JobActions;
};

const initialState: JobState = {
    jobs: [],
    myJobs: [],
    status: 'idle',
    myJobsStatus: 'idle',
};

export const useJobStore = create<JobStore>((set, get) => ({
    ...initialState,

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
                const response = await fetch(`${HTTP_BASE_URL}/jobs?${params.toString()}`, {
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
                const response = await fetch(`${HTTP_BASE_URL}/jobs?${params.toString()}`, {
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
        reset: () => {
            set(initialState);
        },
        reorderJobs: (sourceIndex, destinationIndex) => {
            set((state) => {
                const items = Array.from(state.jobs);
                const [reorderedItem] = items.splice(sourceIndex, 1);
                items.splice(destinationIndex, 0, reorderedItem);
                return { jobs: items };
            });
        },
        saveJobOrder: async () => {
            const originalJobs = get().jobs;
            const { user } = useAuthStore.getState();
            const accessToken = useAuthStore.getState().accessToken;
            const { departments } = useDepartmentStore.getState();

            if (originalJobs.length === 0 || !user?.employee_department) return false;

            const userDepartment = departments.find(
                (dep) => dep.name.toUpperCase() === user.employee_department.toUpperCase()
            );
            if (!userDepartment) return false;

            const payload = {
                department_target_id: userDepartment.id,
                items: originalJobs.map((job) => ({
                    job_id: job.job_id,
                    version: job.version,
                })),
            };

            try {
                const response = await fetch(`${HTTP_BASE_URL}/jobs/reorder`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify(payload),
                });

                if (!response.ok) {
                    throw new Error(`Failed to save order: ${response.status}`);
                }

                get().actions.fetchJobs();
                return true;
            } catch (error) {
                console.error('Error saving job order:', error);
                set({ jobs: originalJobs });
                return false;
            }
        },
    },
}));

export const useJobs = () => useJobStore((state) => state.jobs);
export const useJobStatus = () => useJobStore((state) => state.status);
export const useMyJobs = () => useJobStore((state) => state.myJobs);
export const useMyJobsStatus = () => useJobStore((state) => state.myJobsStatus);
export const useJobActions = () => useJobStore((state) => state.actions);