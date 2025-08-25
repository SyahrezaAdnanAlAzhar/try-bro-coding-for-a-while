import { useState, useEffect } from 'react';
import { useAuthStore } from '../../../../store/authStore';
import { PrebuiltActionButton } from '../../actions/PrebuiltActionButton';
import { Text } from '../../../ui/Text';

interface AvailableAction {
    action_name: string;
    hex_code: string;
    requires_reason: boolean;
    reason_label: string | null;
    requires_file: boolean;
}

interface DynamicJobActionsProps {
    jobId: number;
}

const API_BASE_URL = '/api/e-memo-job-reservation';

export const DynamicJobActions = ({ jobId }: DynamicJobActionsProps) => {
    const [actions, setActions] = useState<AvailableAction[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const accessToken = useAuthStore((state) => state.accessToken);

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

    if (isLoading) {
        return <div className="h-8 w-24 rounded-lg bg-gray-200 animate-pulse" />;
    }

    if (actions.length === 0) {
        return <Text variant="body-sm" color="mono-grey">-</Text>;
    }

    return (
        <div className="flex items-center justify-end gap-2">
            {actions.map((action) => (
                <PrebuiltActionButton
                    key={action.action_name}
                    actionName={action.action_name}
                    size="sm"
                    onClick={() => console.log(`Perform action: ${action.action_name}`)}
                />
            ))}
        </div>
    );
};