import { useEffect } from 'react';
import { Text } from '../components/ui/Text';
import { useApprovalActions } from '../store/approvalStore';
import { ApprovalTable } from '../components/features/approval/ApprovalTable';

export default function ApprovalPage() {
    const { fetchApprovalTickets } = useApprovalActions();

    useEffect(() => {
        fetchApprovalTickets();
    }, [fetchApprovalTickets]);

    return (
        <div className="space-y-6">
            <Text as="h1" variant="display" weight="bold">
                Approval Ticket
            </Text>
            <ApprovalTable />
        </div>
    );
}