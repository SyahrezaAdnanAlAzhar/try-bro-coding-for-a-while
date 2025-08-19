import { useAuthUser } from '../store/authStore';
import { useMemo } from 'react';

export type Permission =
    | 'TICKET_PRIORITY_MANAGE'
    | 'JOB_PRIORITY_MANAGE'
    | 'JOB_ASSIGN_PIC'
    | 'MASTER_USER'
    | 'CREATE_TICKET';

export const useAuthorization = () => {
    const user = useAuthUser();

    const permissions = useMemo(() => {
        return new Set(user?.permissions || []);
    }, [user?.permissions]);

    const can = (permission: Permission): boolean => {
        return permissions.has(permission);
    };

    return { can, permissions: user?.permissions || [] };
};