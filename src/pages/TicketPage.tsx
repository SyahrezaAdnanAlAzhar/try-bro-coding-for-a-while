import { useEffect } from 'react';
import { Text } from '../components/ui/Text';
// import { useAuthStatus } from '../store/authStore';
import { useDepartmentActions, useDepartmentStatus } from '../store/departmentStore';
import { DepartmentSelector } from '../components/features/ticket/DepartmentSelector';
import { TicketSummary } from '../components/features/ticket/TicketSummary';

export default function TicketPage() {
    // const authStatus = useAuthStatus();
    // const isLoggedIn = authStatus === 'authenticated';
    const departmentStatus = useDepartmentStatus();
    const { fetchDepartments } = useDepartmentActions();

    useEffect(() => {
        if (departmentStatus === 'idle') {
            fetchDepartments();
        }
    }, [departmentStatus, fetchDepartments]);

    return (
        <div className="space-y-6">
            <Text as="h1" variant="display" weight="bold" className="text-center">
                Dashboard Ticket Reservation
            </Text>

            {departmentStatus === 'loading' && <Text>Loading departments...</Text>}
            {departmentStatus === 'error' && <Text color="add-red">Failed to load departments.</Text>}
            {departmentStatus === 'success' && (
                <>
                    <div className="space-y-8">
                        <DepartmentSelector />
                        <hr className="h-[3px] w-full bg-mono-light-grey border-none" />
                        <TicketSummary />
                    </div>
                </>
            )}

        </div>
    );
}