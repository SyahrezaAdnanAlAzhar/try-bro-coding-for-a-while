import { type Ticket } from '../../../../types/api';
import { Text } from '../../../ui/Text';
import { StatusCell } from '../../../features/ticket/table/StatusCell';
import { DeadlineCell } from '../../../features/ticket/table/DeadlineCell';
import { HistoryActionsCell } from './HistoryActionsCell';

interface HistoryTableRowProps {
    ticket: Ticket;
    index: number;
}

export const HistoryTableRow = ({ ticket, index }: HistoryTableRowProps) => {
    const firstNameRequestor = ticket.requestor_name?.split(' ')[0] || '';
    return (
        <tr className="border-b border-mono-light-grey bg-mono-white">
            <td className="px-4 py-3 text-center align-middle"><Text weight="bold">{index + 1}</Text></td>
            <td className="px-4 py-3 align-middle"><Text>{ticket.description}</Text></td>
            <td className="px-4 py-3 align-middle"><div className="flex justify-center"><StatusCell statusName={ticket.current_status} /></div></td>
            <td className="px-4 py-3 text-center align-middle"><Text>{ticket.ticket_age_days} Hari</Text></td>
            <td className="px-4 py-3 align-middle"><DeadlineCell deadline={ticket.deadline} daysRemaining={ticket.days_remaining} /></td>
            <td className="px-4 py-3 align-middle"><Text>{firstNameRequestor}</Text><Text weight="bold">{ticket.requestor_department}</Text></td>
            <td className="px-4 py-3 align-middle"><Text>{ticket.pic_name?.split(' ')[0] || '-'}</Text></td>
            <td className="px-4 py-3 align-middle"><HistoryActionsCell ticketId={ticket.ticket_id} /></td>
        </tr>
    );
};