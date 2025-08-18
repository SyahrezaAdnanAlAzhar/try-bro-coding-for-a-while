export interface User {
    user_id: number;
    username: string;
    user_type: string;
    employee_npk: string;
    employee_name: string;
    employee_position: string;
    employee_department: string;
    employee_area: string;
    permissions: string[];
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