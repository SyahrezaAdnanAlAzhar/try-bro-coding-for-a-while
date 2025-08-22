import { type Ticket } from '../../../types/api';
import { Text } from '../../ui/Text';
import { StatusCell } from '../../features/ticket/table/StatusCell';
import { DeadlineCell } from '../../features/ticket/table/DeadlineCell';
import { ApprovalActionsCell } from './ApprovalActionsCell';

interface ApprovalTableRowProps {
    ticket: Ticket;
    index: number;
}

export const ApprovalTableRow = ({ ticket, index }: ApprovalTableRowProps) => {
    const firstNameRequestor = ticket.requestor_name?.split(' ')[0] || '';
    return (
        <tr className="border-b border-mono-light-grey bg-mono-white hover:bg-blue-mtm-100/20">
            <td className="px-4 py-3 text-center"><Text weight="bold">{index + 1}</Text></td>
            <td className="px-4 py-3"><Text>{ticket.description}</Text></td>
            <td className="px-4 py-3"><div className="flex justify-center"><StatusCell statusName={ticket.current_status} hexCode={ticket.current_status_hex_code} /></div></td>
            <td className="px-4 py-3 text-center"><Text>{ticket.ticket_age_days} Hari</Text></td>
            <td className="px-4 py-3"><DeadlineCell deadline={ticket.deadline} daysRemaining={ticket.days_remaining} /></td>
            <td className="px-4 py-3"><Text>{firstNameRequestor}</Text><Text weight="bold">{ticket.requestor_department}</Text></td>
            <td className="px-4 py-3"><ApprovalActionsCell ticketId={ticket.ticket_id} /></td>
        </tr>
    );
};