import { create } from 'zustand';
import { useAuthStore } from './authStore';
import type { Department, PhysicalLocation, SpecifiedLocation } from '../types/api';
import { format } from 'date-fns';
import type { UploadedFile } from '../components/ui/FileInput';
import { HTTP_BASE_URL } from '../config/api';

interface CreateTicketFormData {
    department_target_id: number | null;
    description: string;
    physical_location_id: number | null;
    specified_location_name: string;
    deadline: Date | null;
    support_files: (File | UploadedFile)[];
}

interface FormOptions {
    departments: Department[];
    physicalLocations: PhysicalLocation[];
    specifiedLocations: SpecifiedLocation[];
}

interface FormErrors {
    department_target_id?: string;
    description?: string;
}

interface CreateTicketState {
    formData: CreateTicketFormData;
    options: FormOptions;
    errors: FormErrors;
    status: 'idle' | 'loading' | 'submitting' | 'success' | 'error';
}

interface CreateTicketActions {
    fetchInitialData: () => Promise<void>;
    fetchSpecifiedLocations: (physicalLocationId: number) => Promise<void>;
    setFormField: <K extends keyof CreateTicketFormData>(field: K, value: CreateTicketFormData[K]) => void;
    submitTicket: () => Promise<boolean>;
    reset: () => void;
}

type CreateTicketStore = CreateTicketState & {
    actions: CreateTicketActions;
};

const initialState: CreateTicketState = {
    formData: {
        department_target_id: null,
        description: '',
        physical_location_id: null,
        specified_location_name: '',
        deadline: null,
        support_files: [],
    },
    options: {
        departments: [],
        physicalLocations: [],
        specifiedLocations: [],
    },
    errors: {},
    status: 'idle',
};

export const useCreateTicketStore = create<CreateTicketStore>((set, get) => ({
    ...initialState,

    actions: {
        fetchInitialData: async () => {
            set({ status: 'loading' });
            const accessToken = useAuthStore.getState().accessToken;
            try {
                const [deptRes, locRes] = await Promise.all([
                    fetch(`${HTTP_BASE_URL}/departments?receive_job=true&is_active=true`),
                    fetch(`${HTTP_BASE_URL}/physical-location?is_active=true`, {
                        headers: { Authorization: `Bearer ${accessToken}` },
                    }),
                ]);

                if (!deptRes.ok || !locRes.ok) throw new Error('Failed to fetch initial data');

                const deptData = await deptRes.json();
                const locData = await locRes.json();

                set((state) => ({
                    options: {
                        ...state.options,
                        departments: deptData.data,
                        physicalLocations: locData.data,
                    },
                    status: 'idle',
                }));
            } catch (error) {
                console.error('Error fetching initial data:', error);
                set({ status: 'error' });
            }
        },

        fetchSpecifiedLocations: async (physicalLocationId) => {
            set({ status: 'loading' });
            const accessToken = useAuthStore.getState().accessToken;
            try {
                const response = await fetch(`${HTTP_BASE_URL}/specified-location?physical_location_id=${physicalLocationId}`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                if (!response.ok) throw new Error('Failed to fetch specified locations');
                const { data } = await response.json();
                set((state) => ({
                    options: { ...state.options, specifiedLocations: data },
                    status: 'idle',
                }));
            } catch (error) {
                console.error('Error fetching specified locations:', error);
                set({ status: 'error' });
            }
        },

        setFormField: (field, value) => {
            set((state) => ({
                formData: { ...state.formData, [field]: value },
                errors: { ...state.errors, [field]: undefined },
            }));
            if (field === 'physical_location_id') {
                set((state) => ({
                    formData: { ...state.formData, specified_location_id: '' },
                    options: { ...state.options, specifiedLocations: [] },
                }));
            }
        },

        submitTicket: async () => {
            const { formData } = get();
            const newErrors: FormErrors = {};
            if (!formData.department_target_id) newErrors.department_target_id = 'Departemen wajib diisi.';
            if (!formData.description.trim()) newErrors.description = 'Deskripsi wajib diisi.';

            if (Object.keys(newErrors).length > 0) {
                set({ errors: newErrors });
                return false;
            }

            set({ status: 'submitting' });
            const accessToken = useAuthStore.getState().accessToken;
            const body = new FormData();

            body.append('department_target_id', String(formData.department_target_id));
            body.append('description', formData.description);
            if (formData.physical_location_id) body.append('physical_location_id', String(formData.physical_location_id));
            if (formData.specified_location_name) body.append('specified_location_name', formData.specified_location_name);
            if (formData.deadline) body.append('deadline', format(formData.deadline, 'yyyy-MM-dd'));
            formData.support_files.forEach(file => {
                if (file instanceof File) {
                    body.append('support_files', file);
                }
            });

            try {
                const response = await fetch(`${HTTP_BASE_URL}/tickets`, {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${accessToken}` },
                    body,
                });

                if (!response.ok) throw new Error('Failed to create ticket');

                set({ status: 'success' });
                return true;
            } catch (error) {
                console.error('Error submitting ticket:', error);
                set({ status: 'error' });
                return false;
            }
        },

        reset: () => {
            set(initialState);
        },
    },
}));

export const useCreateTicket = () => useCreateTicketStore((state) => state);
export const useCreateTicketActions = () => useCreateTicketStore((state) => state.actions);