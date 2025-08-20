import { type TicketSummaryItem } from '../../../store/ticketSummaryStore';
import { Text } from '../../ui/Text';

interface TicketSummaryBarProps {
    data: TicketSummaryItem[];
}

export const TicketSummaryBar = ({ data }: TicketSummaryBarProps) => {
    if (!data || data.length === 0) {
        return null;
    }

    return (
        <div className="flex w-full overflow-hidden rounded-lg border border-mono-light-grey bg-mono-white shadow-s-400">
            {data.map((item, _) => (
                <div key={item.status_id} className="flex flex-1 flex-col">
                    <div
                        className="px-3 py-2 text-center"
                        style={{ backgroundColor: item.hex_code }}
                    >
                        <Text variant="body-md" weight="bold" className="text-white">
                            {item.status_name}
                        </Text>
                    </div>
                    <div className="flex h-full items-center justify-center p-1">
                        <Text variant="body-lg" weight="bold">
                            {item.total}
                        </Text>
                    </div>
                </div>
            ))}
        </div>
    );
};