import { useJobs, useJobStatus } from '../../../../store/jobStore';
import { Text } from '../../../ui/Text';
import { JobTableRow } from './JobTableRow';

const TableHeader = () => (
    <thead className="bg-mono-light-grey/70">
        <tr>
            <th className="w-[48px] px-4 py-3 text-center">No</th>
            <th className="px-4 py-3 text-center">Job Description</th>
            <th className="w-[100px] px-4 py-3 text-center">Status</th>
            <th className="w-[120px] px-4 py-3 text-center">Umur Tiket</th>
            <th className="w-[200px] px-4 py-3 text-center">Deadline</th>
            <th className="w-[160px] px-4 py-3 text-center">PIC Job</th>
            <th className="w-[160px] px-4 py-3 text-center">Lokasi</th>
            <th className="w-32 px-4 py-3 text-right"></th>
            <th className="w-32 px-4 py-3 text-right"></th>
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
                <td className="px-4 py-3"><div className="h-8 w-full rounded bg-gray-200 animate-pulse"></div></td>
            </tr>
        ))}
    </tbody>
);

export const JobTable = () => {
    const jobs = useJobs();
    const status = useJobStatus();

    return (
        <div className="overflow-x-auto rounded-[24px] border border-mono-light-grey shadow-s-400">
            <table className="min-w-full table-auto">
                <TableHeader />
                {status === 'loading' && <TableSkeleton />}
                {status === 'success' && (
                    <tbody>
                        {jobs.length > 0 ? (
                            jobs.map((job, index) => (
                                <JobTableRow key={job.ticket_id} job={job} index={index} />
                            ))
                        ) : (
                            <tr><td colSpan={9} className="py-10 text-center"><Text color="mono-grey">Tidak ada data job yang ditemukan.</Text></td></tr>
                        )}
                    </tbody>
                )}
                {status === 'error' && (
                    <tbody>
                        <tr><td colSpan={9} className="py-10 text-center"><Text color="add-red">Gagal memuat data job.</Text></td></tr>
                    </tbody>
                )}
            </table>
        </div>
    );
};