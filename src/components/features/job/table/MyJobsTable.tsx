import { useMyJobs, useMyJobsStatus } from '../../../../store/jobStore';
import { MyJobsTableRow } from './MyJobsTableRow';
import { Text } from '../../../ui/Text';

const TableHeader = () => (
    <thead className="bg-mono-light-grey/70">
        <tr>
            <th className="w-[48px] px-4 py-3 text-center">No</th>
            <th className="px-4 py-3 text-center">Job Description</th>
            <th className="w-[100px] px-4 py-3 text-center">Status</th>
            <th className="w-[120px] px-4 py-3 text-center">Umur Tiket</th>
            <th className="w-[200px] px-4 py-3 text-center">Deadline</th>
            <th className="w-[160px] px-4 py-3 text-center">Lokasi</th>
            <th className="w-[160px] px-4 py-3 text-right">Biaya Pengeluaran</th>
            <th className="w-10 px-4 py-3 text-right"></th>
            <th className="w-56 px-4 py-3 text-right"></th>
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
                <td className="px-4 py-3"><div className="h-6 w-full rounded bg-gray-200 animate-pulse"></div></td>
                <td className="px-4 py-3"><div className="h-6 w-full rounded bg-gray-200 animate-pulse"></div></td>
                <td className="px-4 py-3"><div className="h-8 w-full rounded bg-gray-200 animate-pulse"></div></td>
                <td className="px-4 py-3"><div className="h-8 w-full rounded bg-gray-200 animate-pulse"></div></td>
            </tr>
        ))}
    </tbody>
);

export const MyJobsTable = () => {
    const myJobs = useMyJobs();
    const status = useMyJobsStatus();

    return (
        <div className="overflow-x-auto rounded-[24px] border border-mono-light-grey shadow-s-400">
            <table className="min-w-full table-auto">
                <TableHeader />
                {status === 'loading' && <TableSkeleton />}
                {status === 'success' && (
                    <tbody>
                        {myJobs.length > 0 ? (
                            myJobs.map((job, index) => (
                                <MyJobsTableRow key={job.ticket_id} job={job} index={index} />
                            ))
                        ) : (
                            <tr><td colSpan={8} className="py-10 text-center"><Text color="mono-grey">Anda tidak memiliki job yang di-assign.</Text></td></tr>
                        )}
                    </tbody>
                )}
                {status === 'error' && (
                    <tbody>
                        <tr><td colSpan={8} className="py-10 text-center"><Text color="add-red">Gagal memuat data job Anda.</Text></td></tr>
                    </tbody>
                )}
            </table>
        </div>
    );
};