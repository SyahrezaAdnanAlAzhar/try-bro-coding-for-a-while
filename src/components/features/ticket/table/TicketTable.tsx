import { useTickets, useTicketTableActions, useTicketTableStatus } from '../../../../store/ticketTableStore';
import { useDebouncedCallback } from 'use-debounce';
import { TicketTableRow } from './TicketTableRow';
import { Text } from '../../../ui/Text';
import { SortableTable } from '../../../dnd/SortableTable';
import { SortableTableRow } from '../../../dnd/SortableTableRow';
import { useAuthorization } from '../../../../hooks/useAuthorization';
import { Can } from '../../../auth/Can';
import { useToast } from '../../../../hooks/useToast';

const TableHeader = () => (
    <thead className="bg-mono-light-grey/70">
        <tr>
            <Can permission="TICKET_PRIORITY_MANAGE"><th className="w-12 px-2 py-3"></th></Can>
            <th className="w-[48px] px-4 py-3 text-center text-sm font-bold uppercase text-mono-dark-grey">No</th>
            <th className="px-4 py-3 text-center text-sm font-bold uppercase text-mono-dark-grey">Job Description</th>
            <th className="w-[100px] px-4 py-3 text-center text-sm font-bold uppercase text-mono-dark-grey">Status</th>
            <th className="w-[120px] px-4 py-3 text-center text-sm font-bold uppercase text-mono-dark-grey">Umur Tiket</th>
            <th className="w-[200px] px-4 py-3 text-center text-sm font-bold uppercase text-mono-dark-grey">Deadline</th>
            <th className="w-[160px] px-4 py-3 text-center text-sm font-bold uppercase text-mono-dark-grey">Requestor</th>
            <th className="w-[160px] px-4 py-3 text-center text-sm font-bold uppercase text-mono-dark-grey">PIC Job</th>
            <th className="w-[240px] px-4 py-3 text-right text-sm font-bold uppercase text-mono-dark-grey"></th>
        </tr>
    </thead>
);

const TableSkeleton = () => (
    <tbody>
        {Array.from({ length: 5 }).map((_, i) => (
            <tr key={i} className="border-b border-mono-light-grey">
                {/* NO */}
                <td className="px-4 py-3"><div className="h-6 w-full rounded bg-gray-200 animate-pulse"></div></td>
                {/* JOB DESC */}
                <td className="px-4 py-3"><div className="h-6 rounded bg-gray-200 animate-pulse"></div></td>
                {/* STATUS */}
                <td className="px-4 py-3"><div className="h-10 w-full rounded bg-gray-200 animate-pulse"></div></td>
                {/* UMUR TICKET */}
                <td className="px-4 py-3"><div className="h-6 w-full rounded bg-gray-200 animate-pulse"></div></td>
                {/* DEADLINE */}
                <td className="px-4 py-3"><div className="h-10 w-full rounded bg-gray-200 animate-pulse"></div></td>
                {/* REQUESTOR */}
                <td className="px-4 py-3"><div className="h-10 w-full rounded bg-gray-200 animate-pulse"></div></td>
                {/* PIC JOB */}
                <td className="px-4 py-3"><div className="h-6 w-full rounded bg-gray-200 animate-pulse"></div></td>
                {/* ACTION */}
                <td className="px-4 py-3"><div className="h-8 w-full rounded bg-gray-200 animate-pulse ml-auto"></div></td>
            </tr>
        ))}
    </tbody>
);

export const TicketTable = () => {
    const tickets = useTickets();
    const status = useTicketTableStatus();
    const { reorderTickets, saveTicketOrder } = useTicketTableActions();
    const { can } = useAuthorization();
    const toast = useToast();

    const debouncedSave = useDebouncedCallback(async () => {
        const success = await saveTicketOrder();
        if (success) {
            toast.success('Urutan prioritas berhasil disimpan.');
        } else {
            toast.error('Gagal menyimpan urutan. Data akan dikembalikan.');
        }
    }, 5000);

    const handleReorder = (sourceIndex: number, destinationIndex: number) => {
        reorderTickets(sourceIndex, destinationIndex);
        debouncedSave();
    };

    const canReorder = can('TICKET_PRIORITY_MANAGE');
    const sortableItems = tickets.map(t => ({ id: t.ticket_id }));

    const tableBody = (
        <tbody>
            {tickets.length > 0 ? (
                tickets.map((ticket, index) =>
                    canReorder ? (
                        <SortableTableRow key={ticket.ticket_id} id={ticket.ticket_id}>
                            <TicketTableRow ticket={ticket} index={index} />
                        </SortableTableRow>
                    ) : (
                        <tr key={ticket.ticket_id} className="border-b border-mono-light-grey bg-mono-white">
                            <TicketTableRow ticket={ticket} index={index} />
                        </tr>
                    )
                )
            ) : (
                <tr><td colSpan={canReorder ? 9 : 8} className="py-10 text-center"><Text color="mono-grey">Tidak ada data tiket.</Text></td></tr>
            )}
        </tbody>
    );

    return (
        <div className="overflow-x-auto rounded-[24px] border border-mono-light-grey shadow-s-400">
            <table className="min-w-full table-auto">
                <TableHeader />
                {status === 'loading' && <TableSkeleton />}
                {status === 'success' && (
                    canReorder ? (
                        <SortableTable items={sortableItems} onReorder={handleReorder}>
                            {tableBody}
                        </SortableTable>
                    ) : (
                        tableBody
                    )
                )}
                {status === 'error' && (
                    <tbody>
                        <tr><td colSpan={canReorder ? 9 : 8} className="py-10 text-center"><Text color="add-red">Gagal memuat data.</Text></td></tr>
                    </tbody>
                )}
            </table>
        </div>
    );
};