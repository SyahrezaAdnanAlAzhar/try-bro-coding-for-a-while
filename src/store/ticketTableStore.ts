import { create } from 'zustand';
import type { Ticket } from '../types/api';
import { useAuthStore } from './authStore';
import { useDepartmentStore } from './departmentStore';
import { HTTP_BASE_URL } from '../config/api';

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
}

type TicketTableStore = TicketTableState & {
    actions: TicketTableActions;
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
}

export const useTicketTableStore = create<TicketTableStore>((set, get) => ({
    ...initialState,

    actions: {
        fetchTickets: async ({ departmentId }) => {
            set({ status: 'loading' });
            const { filters, sort } = get();

            const params = new URLSearchParams({
                section_id: '2',
                department_target_id: String(departmentId),
                sort_by: `${sort.by}_${sort.direction}`,
            });

            if (filters.search) {
                params.append('search', filters.search);
            }

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
    },
}));

export const useTickets = () => useTicketTableStore((state) => state.tickets);
export const useTicketTableStatus = () => useTicketTableStore((state) => state.status);
export const useTicketTableFilters = () => useTicketTableStore((state) => state.filters);
export const useTicketTableSort = () => useTicketTableStore((state) => state.sort);
export const useTicketTableActions = () => useTicketTableStore((state) => state.actions);