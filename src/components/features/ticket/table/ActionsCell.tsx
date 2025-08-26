import { ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '../../../ui/Button';
import { Can } from '../../../auth/Can';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../../../ui/Icon';

interface ActionsCellProps {
    ticketId: number;
}

export const ActionsCell = ({ ticketId }: ActionsCellProps) => {
    const navigate = useNavigate();
    const handleView = () => navigate(`/ticket/${ticketId}`);
    const handlePriorityUp = () => console.log(`Priority up for ticket ${ticketId}`);
    const handlePriorityDown = () => console.log(`Priority down for ticket ${ticketId}`);

    return (
        <div className="flex items-center justify-end gap-1">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleView}>
                <Icon name="visibility" className="text-blue-mtm-500" />
            </Button>
            <Can permission="TICKET_PRIORITY_MANAGE">
                <div className="flex items-center">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handlePriorityUp}>
                        <ArrowUp className="h-5 w-5 text-add-green" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handlePriorityDown}>
                        <ArrowDown className="h-5 w-5 text-add-red" />
                    </Button>
                </div>
            </Can>
        </div>
    );
};