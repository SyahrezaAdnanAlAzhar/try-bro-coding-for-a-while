import { useTickets, useTicketTableStatus } from '../../../../store/ticketTableStore';
import { TicketTableRow } from './TicketTableRow';
import { Text } from '../../../ui/Text';

const TableHeader = () => (
    <thead className="bg-mono-light-grey">
        <tr>
            <th className="w-12 px-4 py-3 text-left text-sm font-bold uppercase text-mono-dark-grey">No</th>
            <th className="px-4 py-3 text-left text-sm font-bold uppercase text-mono-dark-grey">Job Description</th>
            <th className="px-4 py-3 text-left text-sm font-bold uppercase text-mono-dark-grey">Status</th>
            <th className="px-4 py-3 text-left text-sm font-bold uppercase text-mono-dark-grey">Umur Tiket</th>
            <th className="px-4 py-3 text-left text-sm font-bold uppercase text-mono-dark-grey">Deadline</th>
            <th className="px-4 py-3 text-left text-sm font-bold uppercase text-mono-dark-grey">Requestor</th>
            <th className="px-4 py-3 text-left text-sm font-bold uppercase text-mono-dark-grey">PIC Job</th>
            <th className="w-32 px-4 py-3 text-right text-sm font-bold uppercase text-mono-dark-grey"></th>
        </tr>
    </thead>
);

const TableSkeleton = () => (
    <tbody>
        {Array.from({ length: 5 }).map((_, i) => (
            <tr key={i} className="border-b border-mono-light-grey">
                <td className="px-4 py-3"><div className="h-6 w-6 rounded bg-gray-200 animate-pulse"></div></td>
                <td className="px-4 py-3"><div className="h-6 rounded bg-gray-200 animate-pulse"></div></td>
                <td className="px-4 py-3"><div className="h-10 w-32 rounded bg-gray-200 animate-pulse"></div></td>
                <td className="px-4 py-3"><div className="h-6 w-20 rounded bg-gray-200 animate-pulse"></div></td>
                <td className="px-4 py-3"><div className="h-10 w-32 rounded bg-gray-200 animate-pulse"></div></td>
                <td className="px-4 py-3"><div className="h-10 w-32 rounded bg-gray-200 animate-pulse"></div></td>
                <td className="px-4 py-3"><div className="h-6 w-24 rounded bg-gray-200 animate-pulse"></div></td>
                <td className="px-4 py-3"><div className="h-8 w-24 rounded bg-gray-200 animate-pulse ml-auto"></div></td>
            </tr>
        ))}
    </tbody>
);

export const TicketTable = () => {
    const tickets = useTickets();
    const status = useTicketTableStatus();

    return (
        <div className="overflow-x-auto rounded-lg border border-mono-light-grey">
            <table className="min-w-full table-auto">
                <TableHeader />
                {status === 'loading' && <TableSkeleton />}
                {status === 'success' && (
                    <tbody>
                        {tickets.length > 0 ? (
                            tickets.map((ticket, index) => (
                                <TicketTableRow key={ticket.ticket_id} ticket={ticket} index={index} />
                            ))
                        ) : (
                            <tr>
                                <td colSpan={8} className="py-10 text-center">
                                    <Text color="mono-grey">Tidak ada data tiket yang ditemukan.</Text>
                                </td>
                            </tr>
                        )}
                    </tbody>
                )}
                {status === 'error' && (
                    <tbody>
                        <tr>
                            <td colSpan={8} className="py-10 text-center">
                                <Text color="add-red">Gagal memuat data tiket.</Text>
                            </td>
                        </tr>
                    </tbody>
                )}
            </table>
        </div>
    );
};