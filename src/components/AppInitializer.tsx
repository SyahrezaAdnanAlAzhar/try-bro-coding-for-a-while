import { useEffect, useRef } from 'react';
import { useStatusActions } from '../store/statusStore';
import { useActionActions } from '../store/actionStore';
import { useAuthStatus } from '../store/authStore';
import { useDepartmentActions } from '../store/departmentStore';

const usePrevious = <T,>(value: T): T | undefined => {
    const ref = useRef<T | undefined>(undefined);

    useEffect(() => {
        ref.current = value;
    });

    return ref.current;
};

export const AppInitializer = () => {
    const authStatus = useAuthStatus();
    const prevAuthStatus = usePrevious(authStatus);

    const { fetchStatuses } = useStatusActions();
    const { fetchDepartments, reset: resetDepartments } = useDepartmentActions();
    const { fetchActions } = useActionActions();


    useEffect(() => {
        fetchStatuses();
        fetchActions();
        fetchDepartments();
    }, []);

    useEffect(() => {
        const loggedIn = prevAuthStatus === 'unauthenticated' && authStatus === 'authenticated';
        const loggedOut = prevAuthStatus === 'authenticated' && authStatus === 'unauthenticated';

        if (loggedIn || loggedOut) {
            resetDepartments();
            fetchDepartments();

        }
    }, [authStatus, prevAuthStatus, resetDepartments, fetchDepartments]);

    return null;
};