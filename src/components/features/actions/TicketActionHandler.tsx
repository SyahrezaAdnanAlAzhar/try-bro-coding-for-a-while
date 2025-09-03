import { useState, useEffect, useMemo } from 'react';
import { useAuthStore } from '../../../store/authStore';
import { useToast } from '../../../hooks/useToast';
import { PrebuiltActionButton } from './PrebuiltActionButton';
import { ExecuteActionModal, type AvailableAction } from './ExecuteActionModal';
import { Button, type ButtonProps } from '../../ui/Button';
import { Can } from '../../auth/Can';
import { AssignPicModal } from '../job/AssignPicModal';

interface TicketActionHandlerProps {
    ticketId: number;
    ticketDescription: string;
    onSuccess?: () => void;
    buttonSize?: ButtonProps['size'];
    fullWidth?: boolean;
}

const API_BASE_URL = '/api/e-memo-job-reservation';

export const TicketActionHandler = ({ ticketId, ticketDescription, onSuccess, buttonSize = 'lg', fullWidth }: TicketActionHandlerProps) => {
    const [actions, setActions] = useState<AvailableAction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const accessToken = useAuthStore((state) => state.accessToken);
    const toast = useToast();

    useEffect(() => {
        const fetchAvailableActions = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${API_BASE_URL}/tickets/${ticketId}/available-actions`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                if (!response.ok) throw new Error('Failed to fetch actions');
                const { data } = await response.json();
                setActions(data || []);
            } catch (error) {
                console.error(`Error fetching actions for ticket ${ticketId}:`, error);
                setActions([]);
            } finally {
                setIsLoading(false);
            }
        };
        if (accessToken) {
            fetchAvailableActions();
        } else {
            setIsLoading(false);
        }
    }, [ticketId, accessToken]);

    const uniqueActions = useMemo(() => {
        const seen = new Set<string>();
        return actions.filter(action => {
            const duplicate = seen.has(action.action_name);
            seen.add(action.action_name);
            return !duplicate;
        });
    }, [actions]);

    const handleExecuteAction = async (formData: FormData) => {
        setIsSubmitting(true);
        try {
            const response = await fetch(`${API_BASE_URL}/tickets/${ticketId}/action`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${accessToken}` },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.status?.message || 'Failed to execute action');
            }

            toast.success(`Aksi berhasil dijalankan.`);
            if (onSuccess) onSuccess();
        } catch (error: any) {
            toast.error(error.message || 'An unexpected error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAssignConfirm = async (picNpk: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/jobs/${ticketId}/assign`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ pic_job: picNpk }),
            });
            if (!response.ok) throw new Error('Failed to assign PIC');
            toast.success(`PIC berhasil di-assign.`);
            if (onSuccess) onSuccess();
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    if (isLoading) {
        return <div className="h-10 w-full rounded-lg bg-gray-200 animate-pulse" />;
    }

    if (uniqueActions.length === 0) {
        return null;
    }

    return (
        <div className="flex w-full flex-col items-center gap-4">
            <Can permission="JOB_ASSIGN_PIC">
                <AssignPicModal
                    jobId={ticketId}
                    jobDescription={ticketDescription}
                    onConfirm={handleAssignConfirm}
                >
                    <Button size={buttonSize} variant="blue-mtm-light" fullWidth>
                        Assign PIC
                    </Button>
                </AssignPicModal>
            </Can>
            {uniqueActions.map((action) => {
                const needsModal = action.require_reason || action.require_file || action.action_name === 'Selesaikan Job';
                if (needsModal) {
                    return (
                        <ExecuteActionModal
                            key={action.action_name}
                            jobDescription={ticketDescription}
                            action={action}
                            onConfirm={handleExecuteAction}
                            isLoading={isSubmitting}
                            buttonSize={buttonSize}
                            fullWidth={fullWidth}
                        />
                    );
                }
                return (
                    <PrebuiltActionButton
                        key={action.action_name}
                        actionName={action.action_name}
                        size={buttonSize}
                        fullWidth={fullWidth}
                        onClick={() => {
                            const body = new FormData();
                            body.append('ActionName', action.action_name);
                            handleExecuteAction(body);
                        }}
                        isLoading={isSubmitting}
                    />
                );
            })}
        </div>
    );
};