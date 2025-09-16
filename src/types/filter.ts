import type { TicketStatus } from './api';

export interface FilterOption {
    value: string | number;
    label: string;
}

export interface FilterOptions {
    statuses: TicketStatus[];
    requestorDepartments: FilterOption[];
    requestors: FilterOption[];
    pics: FilterOption[];
}

export interface SelectedFilters {
    statusIds: number[];
    requestorDepartmentIds: number[];
    requestorNpks: string[];
    picNpks: string[];
}