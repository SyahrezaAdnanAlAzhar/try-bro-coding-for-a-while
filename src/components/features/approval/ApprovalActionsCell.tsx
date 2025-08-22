import { Button } from '../../ui/Button';

interface ApprovalActionsCellProps {
    ticketId: number;
}

export const ApprovalActionsCell = ({ ticketId }: ApprovalActionsCellProps) => {
    const handleApprove = () => console.log(`Approve ticket ${ticketId}`);
    const handleReject = () => console.log(`Reject ticket ${ticketId}`);

    return (
        <div className="flex items-center justify-center gap-2">
            <Button variant="primary-green" size="sm" onClick={handleApprove}>
                Approve
            </Button>
            <Button variant="destructive" size="sm" onClick={handleReject}>
                Tolak
            </Button>
        </div>
    );
};