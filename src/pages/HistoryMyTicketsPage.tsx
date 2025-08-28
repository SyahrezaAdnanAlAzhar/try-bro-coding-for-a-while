import { useEffect } from 'react';
import { Text } from '../components/ui/Text';
import { useHistoryMyTicketActions, useHistoryMyTicketFilters, useHistoryMyTickets, useHistoryMyTicketStatus } from '../store/historyMyTicketStore';
import { HistoryMyTicketToolbar } from '../components/features/history/HistoryMyTicketToolbar';
import { HistoryTable } from '../components/features/history/table/HistoryTable';

export default function HistoryMyTicketsPage() {
    const historyFilters = useHistoryMyTicketFilters();
    const { fetchMyHistoryTickets } = useHistoryMyTicketActions();

    const tickets = useHistoryMyTickets();
    const status = useHistoryMyTicketStatus();

    useEffect(() => {
        fetchMyHistoryTickets();
    }, [historyFilters, fetchMyHistoryTickets]);

    return (
        <div className="space-y-6">
            <Text as="h1" variant="display" weight="bold">
                Riwayat Ticket Saya
            </Text>
            <div className="space-y-4">
                <HistoryMyTicketToolbar />
                <HistoryTable
                    tickets={tickets}
                    status={status}
                    emptyMessage="Anda belum pernah membuat tiket."
                />
            </div>
        </div>
    );
}