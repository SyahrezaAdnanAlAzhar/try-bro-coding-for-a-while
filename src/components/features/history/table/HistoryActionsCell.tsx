import { useNavigate } from 'react-router-dom';
import { Button } from '../../../ui/Button';
import { Icon } from '../../../ui/Icon';

interface HistoryActionsCellProps {
    ticketId: number;
}

export const HistoryActionsCell = ({ ticketId }: HistoryActionsCellProps) => {
    const navigate = useNavigate();
    const handleView = () => navigate(`/ticket/${ticketId}`);

    return (
        <div className="flex items-center justify-end">
            <Button customColor="transparent" size="base" className="h-8 w-8 p-0" onClick={handleView}>
                <Icon name="view_detail" size={28} />
            </Button>
        </div>
    );
};