import { type Ticket } from '../../../types/api';
import { FormField } from '../../ui/FormField';
import { Text } from '../../ui/Text';
import { DeadlineCell } from './table/DeadlineCell';

interface TicketDetailViewProps {
    ticket: Ticket;
}

export const TicketDetailView = ({ ticket }: TicketDetailViewProps) => {
    return (
        <div className="grid grid-cols-1 gap-x-12 md:grid-cols-2">
            <FormField
                label="Department"
                value={ticket.department_target_name}
                readOnly
            />

            <FormField
                label="Requestor"
                value={`${ticket.requestor_npk} - ${ticket.requestor_name} - ${ticket.requestor_department}`}
                readOnly
            />

            <div className="md:col-span-2">
                <FormField
                    as="textarea"
                    label="Job Description"
                    value={ticket.description}
                    readOnly
                    rows={5}
                />
            </div>

            <div className="md:col-span-2">
                <FormField
                    label="PIC Job"
                    value={ticket.pic_name ? `${ticket.pic_npk} - ${ticket.pic_name}` : '-'}
                    readOnly
                />
            </div>

            <FormField
                label="Lokasi Area"
                value={ticket.location_name || '-'}
                readOnly
            />

            <FormField
                label="Lokasi Daerah"
                value={ticket.specified_location_name || '-'}
                readOnly
            />

            <div className="md:col-span-2 rounded-lg border bg-mono-white p-4 space-y-3">
                <label className="mb-2 block text-base font-semibold text-blue-mtm-400">
                    Rangkuman Waktu
                </label>
                <div className="flex items-baseline gap-2">
                    <Text variant="body-sm" color="mono-dark-grey">Usia Tiket :</Text>
                    <Text weight="bold">{ticket.ticket_age_days} Hari</Text>
                </div>
                <div className="flex items-start gap-2">
                    <Text variant="body-sm" color="mono-dark-grey">Deadline :</Text>
                    <DeadlineCell deadline={ticket.deadline} daysRemaining={ticket.days_remaining} className="text-left" />
                </div>
            </div>
        </div>
    );
};