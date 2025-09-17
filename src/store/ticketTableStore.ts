import { create } from 'zustand';
import type { Ticket } from '../types/api';
import { useAuthStore } from './authStore';
import { useDepartmentStore } from './departmentStore';
import { HTTP_BASE_URL } from '../config/api';
import type { FilterOptions, SelectedFilters } from '../types/filter';

interface TicketTableFilters {
    search?: string;
}

interface TicketTableSort {
    by: string;
    direction: 'asc' | 'desc';
}

interface TicketTableState {
    tickets: Ticket[];
    status: 'idle' | 'loading' | 'success' | 'error';
    filters: TicketTableFilters;
    sort: TicketTableSort;
    filterOptions: FilterOptions;
    selectedFilters: SelectedFilters;
}

interface TicketTableActions {
    fetchTickets: (params: { departmentId: number }) => Promise<void>;
    setFilters: (newFilters: Partial<TicketTableFilters>) => void;
    setSort: (newSort: TicketTableSort) => void;
    reset: () => void;
    reorderTickets: (sourceIndex: number, destinationIndex: number) => void;
    saveTicketOrder: () => Promise<boolean>;
    addOrUpdateTicket: (updatedTicket: Ticket) => void;
    removeTicket: (ticketId: number) => void;
    fetchFilterOptions: (params: { sectionId: number; departmentTargetId: number }) => Promise<void>;
    setSelectedFilter: <K extends keyof SelectedFilters>(filterType: K, value: SelectedFilters[K]) => void;
    applyFilters: () => void;
    resetFilters: () => void;
}

type TicketTableStore = TicketTableState & {
    actions: TicketTableActions;
};

const initialSelectedFilters: SelectedFilters = {
    statusIds: [],
    requestorDepartmentIds: [],
    requestorNpks: [],
    picNpks: [],
};

const initialState: TicketTableState = {
    tickets: [],
    status: 'idle',
    filters: {
        search: '',
    },
    sort: {
        by: 'priority',
        direction: 'asc',
    },
    filterOptions: {
        statuses: [],
        requestorDepartments: [],
        requestors: [],
        pics: [],
    },
    selectedFilters: initialSelectedFilters,
}

export const useTicketTableStore = create<TicketTableStore>((set, get) => ({
    ...initialState,

    actions: {
        fetchTickets: async ({ departmentId }) => {
            set({ status: 'loading' });
            const { filters, sort, selectedFilters } = get();

            const params = new URLSearchParams({
                section_id: '2',
                department_target_id: String(departmentId),
                sort_by: `${sort.by}_${sort.direction}`,
            });

            if (filters.search) params.append('search', filters.search);
            selectedFilters.statusIds.forEach(id => params.append('status_id', String(id)));
            selectedFilters.requestorDepartmentIds.forEach(id => params.append('requestor_department_id', String(id)));
            selectedFilters.requestorNpks.forEach(npk => params.append('requestor_npk', npk));
            selectedFilters.picNpks.forEach(npk => params.append('pic_npk', npk));


            try {
                const response = await fetch(`${HTTP_BASE_URL}/tickets?${params.toString()}`);
                if (!response.ok) throw new Error('Failed to fetch tickets');

                const { data } = await response.json();
                set({ tickets: data, status: 'success' });
            } catch (error) {
                console.error('Error fetching tickets:', error);
                set({ status: 'error' });
            }
        },

        setFilters: (newFilters) => {
            set((state) => ({
                filters: { ...state.filters, ...newFilters },
            }));
        },

        setSort: (newSort) => {
            set({ sort: newSort });
        },
        reset: () => {
            initialState
        },
        reorderTickets: (sourceIndex, destinationIndex) => {
            set((state) => {
                const items = Array.from(state.tickets);
                const [reorderedItem] = items.splice(sourceIndex, 1);
                items.splice(destinationIndex, 0, reorderedItem);
                return { tickets: items };
            });
        },
        saveTicketOrder: async () => {
            const originalTickets = get().tickets;
            const accessToken = useAuthStore.getState().accessToken;
            const selectedDepartmentId = useDepartmentStore.getState().selectedDepartmentId;

            if (originalTickets.length === 0 || !selectedDepartmentId) return false;

            const payload = {
                department_target_id: selectedDepartmentId,
                items: originalTickets.map((ticket) => ({
                    ticket_id: ticket.ticket_id,
                    version: ticket.version,
                })),
            };

            try {
                const response = await fetch(`${HTTP_BASE_URL}/tickets/reorder`, {
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

                get().actions.fetchTickets({ departmentId: selectedDepartmentId });
                return true;
            } catch (error) {
                console.error('Error saving ticket order:', error);
                set({ tickets: originalTickets });
                return false;
            }
        },
        addOrUpdateTicket: (updatedTicket) => {
            if (updatedTicket.current_section_name !== 'In Progress') {
                get().actions.removeTicket(updatedTicket.ticket_id);
                return;
            }

            set((state) => {
                const tickets = [...state.tickets];
                const existingIndex = tickets.findIndex(
                    (t) => t.ticket_id === updatedTicket.ticket_id
                );

                if (existingIndex !== -1) {
                    tickets[existingIndex] = updatedTicket;
                } else {
                    tickets.push(updatedTicket);
                }

                const sortedTickets = tickets.sort(
                    (a, b) => a.ticket_priority - b.ticket_priority
                );

                return { tickets: sortedTickets };
            });
        },

        removeTicket: (ticketId) => {
            set((state) => ({
                tickets: state.tickets.filter((t) => t.ticket_id !== ticketId),
            }));
        },

        fetchFilterOptions: async ({ sectionId, departmentTargetId }) => {
            const accessToken = useAuthStore.getState().accessToken;
            const headers = { Authorization: `Bearer ${accessToken}` };
            try {
                const [statusRes, reqDeptRes, reqRes, picRes] = await Promise.all([
                    fetch(`${HTTP_BASE_URL}/status-ticket?section_id=${sectionId}`),
                    fetch(`${HTTP_BASE_URL}/department/options?department_target_id=${departmentTargetId}`, { headers }),
                    fetch(`${HTTP_BASE_URL}/employee/options?role=requestor&department_target_id=${departmentTargetId}`, { headers }),
                    fetch(`${HTTP_BASE_URL}/employee/options?role=pic&department_target_id=${departmentTargetId}`, { headers }),
                ]);

                const statuses = (await statusRes.json()).data;
                const requestorDepartments = (await reqDeptRes.json()).data;
                const requestors = (await reqRes.json()).data;
                const pics = (await picRes.json()).data;

                set({
                    filterOptions: {
                        statuses,
                        requestorDepartments: (requestorDepartments || []).map((d: any) => ({ value: d.id, label: d.name })),
                        requestors: (requestors || []).map((e: any) => ({ value: e.npk, label: `${e.npk} - ${e.name}` })),
                        pics: (pics || []).map((e: any) => ({ value: e.npk, label: `${e.npk} - ${e.name}` })),
                    },
                });
            } catch (error) {
                console.error("Failed to fetch filter options:", error);
            }
        },

        setSelectedFilter: (filterType, value) => {
            set(state => ({ selectedFilters: { ...state.selectedFilters, [filterType]: value } }));
        },

        applyFilters: () => {
            const selectedDepartmentId = useDepartmentStore.getState().selectedDepartmentId;
            if (selectedDepartmentId) {
                get().actions.fetchTickets({ departmentId: selectedDepartmentId });
            }
        },

        resetFilters: () => {
            set({ selectedFilters: initialSelectedFilters });
            get().actions.applyFilters();
        },
    },
}));

export const useTickets = () => useTicketTableStore((state) => state.tickets);
export const useTicketTableStatus = () => useTicketTableStore((state) => state.status);
export const useTicketTableFilters = () => useTicketTableStore((state) => state.filters);
export const useTicketTableSort = () => useTicketTableStore((state) => state.sort);
export const useTicketTableActions = () => useTicketTableStore((state) => state.actions);
export const useTicketTableFilterOptions = () => useTicketTableStore((state) => state.filterOptions);
export const useTicketTableSelectedFilters = () => useTicketTableStore((state) => state.selectedFilters);