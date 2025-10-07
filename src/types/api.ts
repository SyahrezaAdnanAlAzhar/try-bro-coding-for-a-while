export interface User {
    user_id: number;
    username: string;
    user_type: 'employee' | 'master';
    employee_npk?: string;
    employee_name?: string;
    employee_position: string;
    employee_department?: string;
    employee_area?: string;
    permissions: string[] | null;
}

export interface Department {
    id: number;
    name: string;
    receive_job: boolean;
    is_active: boolean;
    created_at: string;
    updated_at: string;
}

export interface TicketStatus {
    id: number;
    name: string;
    sequence: number;
    is_active: boolean;
    section_id: number;
    hex_color: string;
}

export interface Ticket {
    ticket_id: number;
    description: string;
    ticket_priority: number;
    version: number;
    department_target_id: number;
    department_target_name: string;
    job_id: number | null;
    job_priority: number | null;
    spending_amount: number | null;
    location_name: string;
    specified_location_name: string | null;
    created_at: string;
    ticket_age_days: number;
    deadline: string | null;
    days_remaining: number | null;
    requestor_name: string;
    requestor_npk: string;
    requestor_department: string;
    pic_name: string | null;
    pic_npk: string | null;
    pic_area_name: string | null;
    current_status: string;
    current_status_hex_code: string;
    current_section_name: string;
}

export interface PhysicalLocation {
    id: number;
    name: string;
}

export interface SpecifiedLocation {
    id: number;
    physical_location_id: number;
    name: string;
}

export interface WebSocketMessage<T = any> {
    event: string;
    payload: T;
}

export interface PriorityUpdatePayload {
    department_target_id: number;
    message: string;
}

export interface EditingPayload {
    entity: 'ticket_priority' | 'job_priority';
    context_id: number;
    // POSTPONE INFO EDIT
}

export interface ClientEditingPayload {
    entity: 'ticket_priority' | 'job_priority';
    context_id: number;
}

export interface Employee {
    npk: string;
    name: string;
    department_id: number;
    department_name: string;
    area_id: { Int64: number; Valid: boolean };
    area_name: string | null;
    is_active: boolean;
    position: { id: number; name: string };
}

export interface EmployeeOption {
    id: number;
    name: string;
}