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
        <div className="flex items-center justify-end gap-3">
            <Button customColor="transparent" size="base" className="h-8 w-8 p-0" onClick={handleView}>
                <Icon name="view_detail" size={28} />
            </Button>
            <Can permission="TICKET_PRIORITY_MANAGE">
                <div className="flex items-center">
                    <Button customColor="transparent" size="base" className="h-8 w-8 p-0" onClick={handlePriorityUp}>
                        <Icon name="prioritize_up" size={32} />
                    </Button>
                    <Button customColor="transparent" size="base" className="h-8 w-8 p-0" onClick={handlePriorityDown}>
                        <Icon name="prioritize_down" size={32} />
                    </Button>
                </div>
            </Can>
        </div>
    );
};