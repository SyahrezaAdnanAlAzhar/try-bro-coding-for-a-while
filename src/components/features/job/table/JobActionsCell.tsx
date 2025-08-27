import { Button } from '../../../ui/Button';
import { Can } from '../../../auth/Can';
import { useNavigate } from 'react-router-dom';
import { useJobActions, useJobs } from '../../../../store/jobStore';
import { useToast } from '../../../../hooks/useToast';
import { useDebouncedCallback } from 'use-debounce';
import { Icon } from '../../../ui/Icon';

interface JobActionsCellProps {
    jobId: number | null;
    currentIndex: number;
}

export const JobActionsCell = ({ jobId, currentIndex }: JobActionsCellProps) => {
    const navigate = useNavigate();
    const { reorderJobs, saveJobOrder } = useJobActions();
    const jobs = useJobs();
    const toast = useToast();

    if (!jobId) return null;

    const debouncedSave = useDebouncedCallback(async () => {
        const success = await saveJobOrder();
        if (success) {
            toast.success('Urutan prioritas job berhasil disimpan.');
        } else {
            toast.error('Gagal menyimpan urutan job. Data akan dikembalikan.');
        }
    }, 5000);

    const handleView = () => navigate(`/ticket/${jobId}`);
    const handlePriorityUp = () => {
        if (currentIndex > 0) {
            reorderJobs(currentIndex, currentIndex - 1);
            debouncedSave();
        }
    };
    const handlePriorityDown = () => {
        if (currentIndex < jobs.length - 1) {
            reorderJobs(currentIndex, currentIndex + 1);
            debouncedSave();
        }
    };

    return (
        <div className="flex items-center justify-center gap-1">
            <Button customColor="transparent" size="sm" className="h-8 w-8 p-0" onClick={handleView}>
                <Icon name="view_detail" size={28} />
            </Button>
            <Can permission="JOB_PRIORITY_MANAGE">
                <div className="flex items-center">
                    {currentIndex > 0 && (
                        <Button customColor="transparent" size="sm" className="h-8 w-8 p-0" onClick={handlePriorityUp}>
                            <Icon name="prioritize_up" size={32} />
                        </Button>
                    )}
                    {currentIndex < jobs.length - 1 && (
                        <Button customColor="transparent" size="sm" className="h-8 w-8 p-0" onClick={handlePriorityDown}>
                            <Icon name="prioritize_down" size={32} />
                        </Button>
                    )}
                </div>
            </Can>
        </div>
    );
};