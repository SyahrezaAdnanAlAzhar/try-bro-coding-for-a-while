import { useEffect } from 'react';
import { Text } from '../components/ui/Text';
import { useDepartmentStatus, useSelectedDepartmentId } from '../store/departmentStore';
import { useHistoryAllTicketActions, useHistoryAllTicketFilters, useHistoryAllTickets, useHistoryAllTicketStatus } from '../store/historyAllTicketsStore';
import { DepartmentSelector } from '../components/features/ticket/DepartmentSelector';
import { HistoryToolbar } from '../components/features/history/HistoryToolbar';
import { HistoryTable } from '../components/features/history/table/HistoryTable';
import { useSyncDepartmentUrl } from '../hooks/useSyncDepartmentUrl';

export default function HistoryAllTicketsPage() {
    useSyncDepartmentUrl();

    const departmentStatus = useDepartmentStatus();
    const selectedDepartmentId = useSelectedDepartmentId();
    const historyFilters = useHistoryAllTicketFilters();
    const { fetchHistoryTickets } = useHistoryAllTicketActions();

    const tickets = useHistoryAllTickets();
    const status = useHistoryAllTicketStatus();

    useEffect(() => {
        if (selectedDepartmentId) {
            fetchHistoryTickets({ departmentId: selectedDepartmentId });
        }
    }, [selectedDepartmentId, historyFilters, fetchHistoryTickets]);

    return (
        <div className="space-y-6">
            <Text as="h1" variant="display" weight="bold">Riwayat Seluruh Ticket</Text>

            {departmentStatus === 'loading' && <Text className="text-center">Loading departments...</Text>}
            {departmentStatus === 'error' && <Text color="add-red" className="text-center">Failed to load departments.</Text>}

            {departmentStatus === 'success' && (
                <div className="space-y-4">
                    <DepartmentSelector />
                    <HistoryToolbar />
                    <HistoryTable tickets={tickets} status={status} />
                </div>
            )}
        </div>
    );
}