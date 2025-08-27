import { useEffect } from 'react';
import { Text } from '../components/ui/Text';
import { useDepartmentStatus, useSelectedDepartmentId } from '../store/departmentStore';
import { useHistoryAllActions, useHistoryAllFilters } from '../store/historyAllStore';
import { DepartmentSelector } from '../components/features/ticket/DepartmentSelector';
import { HistoryToolbar } from '../components/features/history/HistoryToolbar';
import { HistoryTable } from '../components/features/history/table/HistoryTable';

export default function HistoryAllTicketsPage() {
    const departmentStatus = useDepartmentStatus();
    const selectedDepartmentId = useSelectedDepartmentId();
    const historyFilters = useHistoryAllFilters();
    const { fetchHistoryTickets } = useHistoryAllActions();

    useEffect(() => {
        if (selectedDepartmentId) {
            fetchHistoryTickets({ departmentId: selectedDepartmentId });
        }
    }, [selectedDepartmentId, historyFilters, fetchHistoryTickets]);

    return (
        <div className="space-y-6">
            <Text as="h1" variant="display" weight="bold">
                Riwayat Seluruh Ticket
            </Text>

            {departmentStatus === 'loading' && <Text className="text-center">Loading departments...</Text>}
            {departmentStatus === 'error' && <Text color="add-red" className="text-center">Failed to load departments.</Text>}

            {departmentStatus === 'success' && (
                <div className="space-y-4">
                    <DepartmentSelector />
                    <HistoryToolbar />
                    <HistoryTable />
                </div>
            )}
        </div>
    );
}