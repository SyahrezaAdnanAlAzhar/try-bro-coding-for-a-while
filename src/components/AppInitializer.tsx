import { useEffect } from 'react';
import { useStatusActions } from '../store/statusStore';
import { useDepartmentActions } from '../store/departmentStore';
import { useActionActions } from '../store/actionStore';

export const AppInitializer = () => {
    const { fetchStatuses } = useStatusActions();
    const { fetchDepartments } = useDepartmentActions();
    const { fetchActions } = useActionActions(); 

    useEffect(() => {
        fetchStatuses();
        fetchDepartments();
        fetchActions();
    }, []);

    return null;
};