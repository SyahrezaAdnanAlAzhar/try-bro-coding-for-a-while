import { Text } from '../components/ui/Text';
// import { useAuthStatus } from '../store/authStore';
import { useDepartmentStatus, useSelectedDepartmentId } from '../store/departmentStore';
import { DepartmentSelector } from '../components/features/ticket/DepartmentSelector';
import { TicketSummary } from '../components/features/ticket/TicketSummary';
import { useEffect } from 'react';
import { useTicketTableActions, useTicketTableFilters } from '../store/ticketTableStore';
import { TicketTable } from '../components/features/ticket/table/TicketTable';
import { TicketToolbar } from '../components/features/ticket/TicketToolbar';
import { useNavigate } from 'react-router-dom';
import { Can } from '../components/auth/Can';
import { Button } from '../components/ui/Button';
import { Plus } from 'lucide-react';

export default function TicketPage() {
    const departmentStatus = useDepartmentStatus();
    const selectedDepartmentId = useSelectedDepartmentId();
    const tableFilters = useTicketTableFilters();
    const { fetchTickets } = useTicketTableActions();
    const navigate = useNavigate();

    useEffect(() => {
        if (selectedDepartmentId) {
            fetchTickets({ departmentId: selectedDepartmentId });
        }
    }, [selectedDepartmentId, tableFilters, fetchTickets]);

    return (
        <div className="space-y-6">
            <Text as="h1" variant="display" weight="bold" className="text-center">
                Dashboard Ticket Reservation
            </Text>

            {departmentStatus === 'loading' && <Text>Loading departments...</Text>}
            {departmentStatus === 'error' && <Text color="add-red">Failed to load departments.</Text>}
            {departmentStatus === 'success' && (
                <>
                    <div className="space-y-10">
                        <DepartmentSelector />
                        <hr className="h-[3px] w-full bg-mono-light-grey/50 border-none" />
                        <TicketSummary />
                        <hr className="h-[3px] w-full bg-mono-light-grey/50 border-none" />
                        <Can permission="CREATE_TICKET">
                            <Button
                                variant="blue-mtm-light"
                                size="lg"
                                fullWidth
                                leftIcon={<Plus size={24} strokeWidth={3}/>}
                                onClick={() => navigate('/create-ticket')}
                                className='shadow-s-400'
                            >
                                Tambah Job Reservation
                            </Button>
                            <hr className="h-[3px] w-full bg-mono-light-grey/50 border-none" />
                        </Can>
                        <div className="space-y-8">
                            <TicketToolbar />
                            <TicketTable />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}