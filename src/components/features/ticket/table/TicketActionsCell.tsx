import { Button } from '../../../ui/Button';
import { Can } from '../../../auth/Can';
import { useNavigate } from 'react-router-dom';
import { Icon } from '../../../ui/Icon';
import { useTickets, useTicketTableActions } from '../../../../store/ticketTableStore';
import { useToast } from '../../../../hooks/useToast';
import { useDebouncedCallback } from 'use-debounce';

interface ActionsCellProps {
    ticketId: number;
    currentIndex: number;
}

export const ActionsCell = ({ ticketId, currentIndex }: ActionsCellProps) => {
    const navigate = useNavigate();
    const { reorderTickets, saveTicketOrder } = useTicketTableActions();
    const tickets = useTickets();
    const toast = useToast();

    const debouncedSave = useDebouncedCallback(async () => {
        const success = await saveTicketOrder();
        if (success) {
            toast.success('Urutan prioritas berhasil disimpan.');
        } else {
            toast.error('Gagal menyimpan urutan. Data akan dikembalikan.');
        }
    }, 5000);

    const handleView = () => navigate(`/ticket/${ticketId}`);
    const handlePriorityUp = () => {
        if (currentIndex > 0) {
            reorderTickets(currentIndex, currentIndex - 1);
            debouncedSave();
        }
    };
    const handlePriorityDown = () => {
        if (currentIndex < tickets.length - 1) {
            reorderTickets(currentIndex, currentIndex + 1);
            debouncedSave();
        }
    };

    return (
        <div className="flex items-center justify-end gap-3">
            <Button customColor="transparent" size="base" className="h-8 w-8 p-0" onClick={handleView}>
                <Icon name="view_detail" size={28} />
            </Button>
            <Can permission="TICKET_PRIORITY_MANAGE">
                <div className="flex items-center">
                    {currentIndex > 0 && (
                        <Button customColor="transparent" size="base" className="h-8 w-8 p-0" onClick={handlePriorityUp}>
                            <Icon name="prioritize_up" size={32} />
                        </Button>
                    )}
                    {currentIndex < tickets.length - 1 && (
                        <Button customColor="transparent" size="base" className="h-8 w-8 p-0" onClick={handlePriorityDown}>
                            <Icon name="prioritize_down" size={32} />
                        </Button>
                    )}
                </div>
            </Can>
        </div>
    );
};