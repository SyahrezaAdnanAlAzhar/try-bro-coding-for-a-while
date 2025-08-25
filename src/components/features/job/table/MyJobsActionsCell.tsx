import { Eye } from 'lucide-react';
import { Button } from '../../../ui/Button';
import { useState } from 'react';
import { useAuthStore } from '../../../../store/authStore';
import { useJobActions } from '../../../../store/jobStore';
import { useToast } from '../../../../hooks/useToast';

interface MyJobsActionsCellProps {
    jobId: number | null;
}

const API_BASE_URL = '/api/e-memo-job-reservation';

export const MyJobsActionsCell = ({ jobId }: MyJobsActionsCellProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const accessToken = useAuthStore((state) => state.accessToken);
    const { fetchMyJobs } = useJobActions();
    const toast = useToast();


    if (!jobId) return null;

    const handleView = () => console.log(`View job ${jobId}`);
    const handleStartWork = async () => {
        setIsLoading(true);
        const body = new FormData();
        body.append('ActionName', 'Mulai Mengerjakan');

        try {
            const response = await fetch(`${API_BASE_URL}/tickets/${jobId}/action`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                body,
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.status?.message || 'Failed to start job');
            }

            toast.success(`Pekerjaan untuk job #${jobId} telah dimulai.`);
            fetchMyJobs();
        } catch (error: any) {
            toast.error(error.message || 'An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleView}>
                <Eye className="h-5 w-5 text-blue-mtm-500" />
            </Button>
            <Button
                variant="blue-mtm-light"
                size="sm"
                onClick={handleStartWork}
                isLoading={isLoading}
            >
                Mulai Kerjakan
            </Button>
        </div>
    );
};