import { type Ticket } from '../../../../types/api';
import { Text } from '../../../ui/Text';
import { DeadlineCell } from './DeadlineCell';
import { ActionsCell } from './ActionsCell';
import { StatusCell } from './StatusCell';

interface TicketTableRowProps {
    ticket: Ticket;
    index: number;
}

export const TicketTableRow = ({ ticket, index }: TicketTableRowProps) => {
    const firstNamePic = ticket.pic_name?.split(' ')[0] || '';
    const firstNameRequestor = ticket.requestor_name?.split(' ')[0] || '';
    return (
        <>
            <td className="px-4 py-3 text-center">
                <Text weight="bold">{index + 1}</Text>
            </td>
            <td className="px-4 py-3">
                <Text>{ticket.description}</Text>
            </td>
            <td className="px-4 py-3">
                <div className="flex items-center justify-center">
                    <StatusCell statusName={ticket.current_status} />
                </div>
            </td>
            <td className="px-4 py-3">
                <Text className="text-right">{ticket.ticket_age_days} Hari</Text>
            </td>
            <td className="px-4 py-3">
                <DeadlineCell deadline={ticket.deadline} daysRemaining={ticket.days_remaining} className="text-center" />
            </td>
            <td className="px-4 py-3">
                <Text>{firstNameRequestor}</Text>
                <Text weight="bold">{ticket.requestor_department}</Text>
            </td>
            <td className="px-4 py-3">
                <Text>{firstNamePic || '-'}</Text>
            </td>
            <td className="px-4 py-3">
                <div className="flex items-center justify-center">
                    <ActionsCell ticketId={ticket.ticket_id} currentIndex={index} />
                </div>
            </td>
        </>
    );
};