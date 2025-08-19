import { useEffect } from 'react';
import { Button } from '../components/ui/Button';
import { Text } from '../components/ui/Text';
import { useAuthStatus } from '../store/authStore';
import { useDepartmentActions, useDepartmentStatus } from '../store/departmentStore';

export default function TicketPage() {
    const authStatus = useAuthStatus();
    const isLoggedIn = authStatus === 'authenticated';
    const departmentStatus = useDepartmentStatus();
    const { fetchDepartments } = useDepartmentActions();

    useEffect(() => {
        if (departmentStatus === 'idle') {
            fetchDepartments();
        }
    }, [departmentStatus, fetchDepartments]);

    return (
        <div className="space-y-6">
            <Text as="h1" variant="display" weight="bold">
                Dashboard Ticket Reservation
            </Text>

            {departmentStatus === 'loading' && <Text>Loading departments...</Text>}
            {departmentStatus === 'error' && <Text color="add-red">Failed to load departments.</Text>}
        </div>
    );
}