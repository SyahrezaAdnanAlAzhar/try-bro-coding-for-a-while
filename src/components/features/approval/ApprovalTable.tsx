import { useApprovalTickets, useApprovalStatus } from '../../../store/approvalStore';
import { ApprovalTableRow } from './ApprovalTableRow';
import { Text } from '../../ui/Text';

const TableHeader = () => (
    <thead className="bg-mono-light-grey/70">
        <tr>
            <th className="w-12 px-4 py-3 text-left text-sm font-bold uppercase text-mono-dark-grey">No</th>
            <th className="px-4 py-3 text-left text-sm font-bold uppercase text-mono-dark-grey">Job Description</th>
            <th className="px-4 py-3 text-left text-sm font-bold uppercase text-mono-dark-grey">Status</th>
            <th className="px-4 py-3 text-left text-sm font-bold uppercase text-mono-dark-grey">Umur Tiket</th>
            <th className="px-4 py-3 text-left text-sm font-bold uppercase text-mono-dark-grey">Deadline</th>
            <th className="px-4 py-3 text-left text-sm font-bold uppercase text-mono-dark-grey">Requestor</th>
            <th className="w-56 px-4 py-3 text-center text-sm font-bold uppercase text-mono-dark-grey">Actions</th>
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
                <td className="px-4 py-3"><div className="h-10 w-full rounded bg-gray-200 animate-pulse"></div></td>
            </tr>
        ))}
    </tbody>
);

export const ApprovalTable = () => {
    const tickets = useApprovalTickets();
    const status = useApprovalStatus();

    return (
        <div className="overflow-x-auto rounded-[24px] border border-mono-light-grey shadow-s-400">
            <table className="min-w-full table-auto">
                <TableHeader />
                {status === 'loading' && <TableSkeleton />}
                {status === 'success' && (
                    <tbody>
                        {tickets.length > 0 ? (
                            tickets.map((ticket, index) => (
                                <ApprovalTableRow key={ticket.ticket_id} ticket={ticket} index={index} />
                            ))
                        ) : (
                            <tr><td colSpan={7} className="py-10 text-center"><Text color="mono-grey">Tidak ada tiket yang menunggu approval.</Text></td></tr>
                        )}
                    </tbody>
                )}
                {status === 'error' && (
                    <tbody>
                        <tr><td colSpan={7} className="py-10 text-center"><Text color="add-red">Gagal memuat data approval.</Text></td></tr>
                    </tbody>
                )}
            </table>
        </div>
    );
};