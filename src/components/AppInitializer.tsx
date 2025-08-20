import { useEffect } from 'react';
import { useStatusActions } from '../store/statusStore';
import { useDepartmentActions } from '../store/departmentStore';

export const AppInitializer = () => {
    const { fetchStatuses } = useStatusActions();
    const { fetchDepartments } = useDepartmentActions();

    useEffect(() => {
        fetchStatuses();
        fetchDepartments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return null;
};