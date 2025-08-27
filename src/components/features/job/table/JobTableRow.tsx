import { type Ticket } from '../../../../types/api';
import { Text } from '../../../ui/Text';
import { StatusCell } from '../../../features/ticket/table/StatusCell';
import { DeadlineCell } from '../../../features/ticket/table/DeadlineCell';
import { JobPicCell } from './JobPicCell';
import { JobLocationCell } from './JobLocationCell';
import { JobActionsCell } from './JobActionsCell';
import { DynamicJobActions } from './DynamicJobActions';

interface JobTableRowProps {
    job: Ticket;
    index: number;
}

export const JobTableRow = ({ job, index }: JobTableRowProps) => {
    return (
        <>
            <td className="px-4 py-3 text-center">
                <Text weight="bold">{index + 1}</Text>
            </td>
            <td className="px-4 py-3 text-left">
                <Text>{job.description}</Text>
            </td>
            <td className="px-4 py-3">
                <div className="flex justify-center">
                    <StatusCell statusName={job.current_status} />
                </div>
            </td>
            <td className="px-4 py-3 text-center">
                <Text>{job.ticket_age_days} Hari</Text>
            </td>
            <td className="px-4 py-3">
                <DeadlineCell deadline={job.deadline} daysRemaining={job.days_remaining} className="text-center" />
            </td>
            <td className="px-4 py-3 text-center">
                <JobPicCell picName={job.pic_name} jobId={job.job_id!} jobDescription={job.description} />
            </td>
            <td className="px-4 py-3">
                <JobLocationCell physical={job.location_name} specified={job.specified_location_name} />
            </td>
            <td className="px-4 py-3">
                <JobActionsCell jobId={job.job_id} currentIndex={index} />
            </td>
            <td className="px-4 py-3">
                <div className="flex justify-center">
                    {job.job_id && <DynamicJobActions jobId={job.job_id} jobDescription={job.description} />}
                </div>
            </td>
        </>
    );
};