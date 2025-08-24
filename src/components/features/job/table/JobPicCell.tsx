import { useToast } from '../../../../hooks/useToast';
import { useAuthStore } from '../../../../store/authStore';
import { useJobActions } from '../../../../store/jobStore';
import { Can } from '../../../auth/Can';
import { Button } from '../../../ui/Button';
import { Text } from '../../../ui/Text';
import { AssignPicModal } from '../AssignPicModal';

interface JobPicCellProps {
    picName: string | null;
    jobId: number;
    jobDescription: string;
}

const API_BASE_URL = '/api/e-memo-job-reservation';

export const JobPicCell = ({ picName, jobId, jobDescription }: JobPicCellProps) => {
    const accessToken = useAuthStore((state) => state.accessToken);
    const { fetchJobs } = useJobActions();
    const toast = useToast();

    const handleAssignConfirm = async (picNpk: string) => {
        try {
            const response = await fetch(`${API_BASE_URL}/jobs/${jobId}/assign`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ pic_job: picNpk }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.status?.message || 'Failed to assign PIC');
            }

            toast.success(`PIC berhasil di-assign ke job #${jobId}`);
            fetchJobs();
        } catch (error: any) {
            toast.error(error.message || 'An unexpected error occurred');
        }
    };

    if (picName) {
        return <Text>{picName.split(' ')[0]}</Text>;
    }

    return (
        <Can permission="JOB_ASSIGN_PIC">
            <AssignPicModal
                jobId={jobId}
                jobDescription={jobDescription}
                onConfirm={handleAssignConfirm}
            >
                <Button size="base" variant="blue-mtm-dark">
                    Assign
                </Button>
            </AssignPicModal>
        </Can>
    );
};