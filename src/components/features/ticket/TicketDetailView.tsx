import { type Ticket } from '../../../types/api';
import { FormField } from '../../ui/FormField';
import { Text } from '../../ui/Text';
import { DeadlineCell } from './table/DeadlineCell';

interface TicketDetailViewProps {
    ticket: Ticket;
}

export const TicketDetailView = ({ ticket }: TicketDetailViewProps) => {
    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FormField
                label="Department"
                value={ticket.department_target_name}
                readOnly
            />

            <FormField
                label="Requestor"
                value={`${ticket.requestor_name} - ${ticket.requestor_department}`}
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

            <div className="md:col-span-2 rounded-lg border bg-mono-white p-4">
                <label className="mb-2 block text-base font-semibold text-blue-mtm-400">
                    Rangkuman Waktu
                </label>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Text variant="body-sm" color="mono-dark-grey">Usia Tiket</Text>
                        <Text weight="bold">{ticket.ticket_age_days} Hari</Text>
                    </div>
                    <div>
                        <Text variant="body-sm" color="mono-dark-grey">Deadline</Text>
                        <DeadlineCell deadline={ticket.deadline} daysRemaining={ticket.days_remaining} />
                    </div>
                </div>
            </div>
        </div>
    );
};