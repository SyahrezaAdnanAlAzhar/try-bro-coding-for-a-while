import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDepartmentStore } from '../store/departmentStore';

export const useSyncDepartmentUrl = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { departments, selectedDepartmentId, actions } = useDepartmentStore();
    const isInitialLoad = useRef(true);

    useEffect(() => {
        if (isInitialLoad.current) {
            const searchParams = new URLSearchParams(location.search);
            const deptIdFromUrl = searchParams.get('department_id');

            if (deptIdFromUrl) {
                actions.setSelectedDepartment(parseInt(deptIdFromUrl, 10));
            }
            isInitialLoad.current = false;
        }
    }, [location.search, actions]);

    useEffect(() => {
        if (!selectedDepartmentId || departments.length === 0 || isInitialLoad.current) {
            return;
        }

        const searchParams = new URLSearchParams(location.search);
        const currentDeptIdInUrl = searchParams.get('department_id');

        if (String(selectedDepartmentId) !== currentDeptIdInUrl) {
            searchParams.set('department_id', String(selectedDepartmentId));
            navigate(`${location.pathname}?${searchParams.toString()}`, { replace: true });
        }
    }, [selectedDepartmentId, departments, location, navigate]);
};