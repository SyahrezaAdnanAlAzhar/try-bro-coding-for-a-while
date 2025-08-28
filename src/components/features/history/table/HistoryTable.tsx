import { HistoryTableRow } from './HistoryTableRow';
import { Text } from '../../../ui/Text';
import type { Ticket } from '../../../../types/api';

const TableHeader = () => (
    <thead className="bg-mono-light-grey/70">
        <tr>
            <th className="w-12 px-4 py-3 text-left">No</th>
            <th className="px-4 py-3 text-left">Job Description</th>
            <th className="px-4 py-3 text-center">Status</th>
            <th className="px-4 py-3 text-center">Umur Tiket</th>
            <th className="px-4 py-3 text-left">Deadline</th>
            <th className="px-4 py-3 text-left">Requestor</th>
            <th className="px-4 py-3 text-left">PIC Job</th>
            <th className="w-20 px-4 py-3 text-right"></th>
        </tr>
    </thead>
);

const TableSkeleton = () => (
    <tbody>
        {Array.from({ length: 5 }).map((_, i) => (
            <tr key={i} className="border-b border-mono-light-grey">
                <td className="px-4 py-3"><div className="h-6 w-full rounded bg-gray-200 animate-pulse"></div></td>
                <td className="px-4 py-3"><div className="h-6 rounded bg-gray-200 animate-pulse"></div></td>
                <td className="px-4 py-3"><div className="h-10 w-full rounded bg-gray-200 animate-pulse"></div></td>
                <td className="px-4 py-3"><div className="h-6 w-full rounded bg-gray-200 animate-pulse"></div></td>
                <td className="px-4 py-3"><div className="h-10 w-full rounded bg-gray-200 animate-pulse"></div></td>
                <td className="px-4 py-3"><div className="h-10 w-full rounded bg-gray-200 animate-pulse"></div></td>
                <td className="px-4 py-3"><div className="h-6 w-full rounded bg-gray-200 animate-pulse"></div></td>
                <td className="px-4 py-3"><div className="h-8 w-full rounded bg-gray-200 animate-pulse"></div></td>
            </tr>
        ))}
    </tbody>
);

interface HistoryTableProps {
    tickets: Ticket[];
    status: 'idle' | 'loading' | 'success' | 'error';
    emptyMessage?: string;
}

export const HistoryTable = ({
    tickets,
    status,
    emptyMessage = "Tidak ada data riwayat tiket.",
}: HistoryTableProps) => {
    return (
        <div className="overflow-x-auto rounded-[24px] border border-mono-light-grey shadow-s-400">
            <table className="min-w-full table-auto">
                <TableHeader />
                {status === 'loading' && <TableSkeleton />}
                {status === 'success' && (
                    <tbody>
                        {tickets.length > 0 ? (
                            tickets.map((ticket, index) => (
                                <HistoryTableRow key={ticket.ticket_id} ticket={ticket} index={index} />
                            ))
                        ) : (
                            <tr><td colSpan={8} className="py-10 text-center"><Text color="mono-grey">{emptyMessage}</Text></td></tr>
                        )}
                    </tbody>
                )}
                {status === 'error' && (
                    <tbody>
                        <tr><td colSpan={8} className="py-10 text-center"><Text color="add-red">Gagal memuat data riwayat.</Text></td></tr>
                    </tbody>
                )}
            </table>
        </div>
    );
};