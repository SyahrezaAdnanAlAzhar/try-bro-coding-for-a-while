import { type Ticket } from '../../../../types/api';
import { Text } from '../../../ui/Text';
import { StatusCell } from '../../../features/ticket/table/StatusCell';
import { DeadlineCell } from '../../../features/ticket/table/DeadlineCell';
import { JobLocationCell } from './JobLocationCell';
import { DynamicJobActions } from './DynamicJobActions';

interface MyJobsTableRowProps {
    job: Ticket;
    index: number;
}

export const MyJobsTableRow = ({ job, index }: MyJobsTableRowProps) => {
    const firstNameRequestor = job.requestor_name?.split(' ')[0] || '';
    return (
        <tr className="border-b border-mono-light-grey bg-mono-white hover:bg-blue-mtm-100/20">
            <td className="px-4 py-3 text-center"><Text weight="bold">{index + 1}</Text></td>
            <td className="px-4 py-3 text-left"><Text>{job.description}</Text></td>
            <td className="px-4 py-3"><div className="flex justify-center"><StatusCell statusName={job.current_status} /></div></td>
            <td className="px-4 py-3 text-center"><Text>{job.ticket_age_days} Hari</Text></td>
            <td className="px-4 py-3"><DeadlineCell deadline={job.deadline} daysRemaining={job.days_remaining} /></td>
            <td className="px-4 py-3"><Text>{firstNameRequestor}</Text><Text weight="bold">{job.requestor_department}</Text></td>
            <td className="px-4 py-3"><JobLocationCell physical={job.location_name} specified={job.specified_location_name} /></td>
            <td className="px-4 py-3">{job.job_id && <DynamicJobActions jobId={job.job_id} />}</td>
        </tr>
    );
};