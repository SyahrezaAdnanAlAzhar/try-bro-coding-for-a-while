import { useState } from 'react';
import { RejectTicketModal } from './RejectTicketModal';
import { useAuthStore } from '../../../store/authStore';
import { useApprovalActions } from '../../../store/approvalStore';
import { useToast } from '../../../hooks/useToast';
import { PrebuiltActionButton } from '../actions/PrebuiltActionButton';
import { HTTP_BASE_URL } from '../../../config/api';

interface ApprovalActionsCellProps {
    ticketId: number;
}

export const ApprovalActionsCell = ({ ticketId }: ApprovalActionsCellProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const accessToken = useAuthStore((state) => state.accessToken);
    const { fetchApprovalTickets } = useApprovalActions();
    const toast = useToast();

    const handleAction = async (actionName: 'Approve' | 'Tolak', reason?: string) => {
        if (!accessToken) {
            toast.error('Authentication error. Please log in again.');
            return;
        }

        setIsLoading(true);

        const body = new FormData();
        body.append('ActionName', actionName);
        if (reason) {
            body.append('Reason', reason);
        }

        try {
            const response = await fetch(`${HTTP_BASE_URL}/tickets/${ticketId}/action`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                body,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.status?.message || 'Failed to perform action');
            }

            toast.success(`Ticket #${ticketId} telah di${actionName.toLowerCase()}.`);
            fetchApprovalTickets();
        } catch (error: any) {
            toast.error(error.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleApprove = () => {
        handleAction('Approve');
    };

    const handleRejectConfirm = (reason: string) => {
        handleAction('Tolak', reason);
    };

    return (
        <div className="flex items-center justify-center gap-2">
            <PrebuiltActionButton
                actionName="Approve"
                size="base"
                onClick={handleApprove}
                isLoading={isLoading}
            />
            <RejectTicketModal
                ticketId={ticketId}
                onConfirm={handleRejectConfirm}
            />
        </div>
    );
};