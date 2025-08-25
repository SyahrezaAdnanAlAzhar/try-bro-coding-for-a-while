import { useState, useEffect } from 'react';
import { useAuthStore } from '../../../../store/authStore';
import { PrebuiltActionButton } from '../../actions/PrebuiltActionButton';
import { Text } from '../../../ui/Text';
import { useJobActions } from '../../../../store/jobStore';
import { useToast } from '../../../../hooks/useToast';
import { ExecuteActionModal } from '../../actions/ExecuteActionModal';

interface AvailableAction {
    action_name: string;
    hex_code: string;
    require_reason: boolean;
    reason_label: string | null;
    require_file: boolean;
}

interface DynamicJobActionsProps {
    jobId: number;
    jobDescription: string;
}

const API_BASE_URL = '/api/e-memo-job-reservation';

export const DynamicJobActions = ({ jobId, jobDescription }: DynamicJobActionsProps) => {
    const [actions, setActions] = useState<AvailableAction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const accessToken = useAuthStore((state) => state.accessToken);
    const { fetchMyJobs } = useJobActions();
    const toast = useToast();

    useEffect(() => {
        const fetchAvailableActions = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${API_BASE_URL}/tickets/${jobId}/available-actions`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                if (!response.ok) throw new Error('Failed to fetch actions');
                const { data } = await response.json();
                setActions(data || []);
            } catch (error) {
                console.error(`Error fetching actions for job ${jobId}:`, error);
                setActions([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAvailableActions();
    }, [jobId, accessToken]);

    const handleExecuteAction = async (formData: FormData) => {
        setIsSubmitting(true);
        try {
            const response = await fetch(`${API_BASE_URL}/tickets/${jobId}/action`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${accessToken}` },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.status?.message || 'Failed to execute action');
            }

            toast.success(`Aksi berhasil dijalankan.`);
            fetchMyJobs();
        } catch (error: any) {
            toast.error(error.message || 'An unexpected error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return <div className="h-8 w-24 rounded-lg bg-gray-200 animate-pulse" />;
    }

    if (actions.length === 0) {
        return <Text variant="body-sm" color="mono-grey"></Text>;
    }

    return (
        <div className="flex items-center justify-end gap-2">
            {actions.map((action) => {
                const needsModal = action.require_file || action.require_reason;
                if (needsModal) {
                    return (
                        <ExecuteActionModal
                            key={action.action_name}
                            jobDescription={jobDescription}
                            action={action}
                            onConfirm={handleExecuteAction}
                            isLoading={isSubmitting}
                        />
                    );
                }
                return (
                    <PrebuiltActionButton
                        key={action.action_name}
                        actionName={action.action_name}
                        size="sm"
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