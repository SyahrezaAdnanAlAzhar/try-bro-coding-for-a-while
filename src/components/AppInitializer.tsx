import { useEffect } from 'react';
import { useStatusActions } from '../store/statusStore';
import { useActionActions } from '../store/actionStore';

export const AppInitializer = () => {
    const { fetchStatuses } = useStatusActions();
    const { fetchActions } = useActionActions();

    useEffect(() => {
        fetchStatuses();
        fetchActions();
    }, []);

    return null;
};