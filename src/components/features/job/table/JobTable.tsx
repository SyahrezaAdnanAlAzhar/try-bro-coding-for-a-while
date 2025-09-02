import { useDebouncedCallback } from 'use-debounce';
import { useAuthorization } from '../../../../hooks/useAuthorization';
import { useToast } from '../../../../hooks/useToast';
import { useJobActions, useJobs, useJobStatus } from '../../../../store/jobStore';
import { Can } from '../../../auth/Can';
import { SortableTable } from '../../../dnd/SortableTable';
import { SortableTableRow } from '../../../dnd/SortableTableRow';
import { Text } from '../../../ui/Text';
import { JobTableRow } from './JobTableRow';

const TableHeader = () => (
    <thead className="bg-mono-light-grey/70">
        <tr>
            <Can permission="JOB_PRIORITY_MANAGE"><th className="w-12 px-2 py-3"></th></Can>
            <th className="w-[48px] px-4 py-3 text-center">No</th>
            <th className="px-4 py-3 text-center">Job Description</th>
            <th className="w-[100px] px-4 py-3 text-center">Status</th>
            <th className="w-[120px] px-4 py-3 text-center">Umur Tiket</th>
            <th className="w-[200px] px-4 py-3 text-center">Deadline</th>
            <th className="w-[160px] px-4 py-3 text-center">PIC Job</th>
            <th className="w-[160px] px-4 py-3 text-center">Lokasi</th>
            <th className="w-[160px] px-4 py-3 text-right">Biaya Pengeluaran</th>
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
    const { reorderJobs, saveJobOrder } = useJobActions();
    const { can } = useAuthorization();
    const toast = useToast();

    const debouncedSave = useDebouncedCallback(async () => {
        const success = await saveJobOrder();
        if (success) {
            toast.success('Urutan prioritas job berhasil disimpan.');
        } else {
            toast.error('Gagal menyimpan urutan job. Data akan dikembalikan.');
        }
    }, 5000);

    const handleReorder = (sourceIndex: number, destinationIndex: number) => {
        reorderJobs(sourceIndex, destinationIndex);
        debouncedSave();
    };

    const canReorder = can('JOB_PRIORITY_MANAGE');
    const sortableItems = jobs.map(j => ({ id: j.ticket_id }));

    const tableBody = (
        <tbody>
            {jobs.length > 0 ? (
                jobs.map((job, index) =>
                    canReorder ? (
                        <SortableTableRow key={job.ticket_id} id={job.ticket_id}>
                            <JobTableRow job={job} index={index} />
                        </SortableTableRow>
                    ) : (
                        <tr key={job.ticket_id} className="border-b border-mono-light-grey bg-mono-white">
                            <JobTableRow job={job} index={index} />
                        </tr>
                    )
                )
            ) : (
                <tr><td colSpan={canReorder ? 10 : 9} className="py-10 text-center"><Text color="mono-grey">Tidak ada data job.</Text></td></tr>
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
                        <tr><td colSpan={canReorder ? 10 : 9} className="py-10 text-center"><Text color="add-red">Gagal memuat data.</Text></td></tr>
                    </tbody>
                )}
            </table>
        </div>
    );
};