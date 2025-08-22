import { PrebuiltActionButton } from '../actions/PrebuiltActionButton';

interface ApprovalActionsCellProps {
    ticketId: number;
}

export const ApprovalActionsCell = ({ ticketId }: ApprovalActionsCellProps) => {
    const handleApprove = () => console.log(`Approve ticket ${ticketId}`);
    const handleReject = () => console.log(`Reject ticket ${ticketId}`);

    return (
        <div className="flex items-center justify-center gap-2">
            <PrebuiltActionButton
                actionName="Approve"
                size="base"
                onClick={handleApprove}
            />
            <PrebuiltActionButton
                actionName="Tolak"
                size="base"
                onClick={handleReject}
            />
        </div>
    );
};