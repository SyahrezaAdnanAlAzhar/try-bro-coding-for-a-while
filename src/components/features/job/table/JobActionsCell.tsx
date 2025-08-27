import { Eye, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '../../../ui/Button';
import { Can } from '../../../auth/Can';
import { useNavigate } from 'react-router-dom';
import { useJobActions, useJobs } from '../../../../store/jobStore';
import { useToast } from '../../../../hooks/useToast';
import { useDebouncedCallback } from 'use-debounce';

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
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleView}>
                <Eye className="h-5 w-5 text-blue-mtm-500" />
            </Button>
            <Can permission="JOB_PRIORITY_MANAGE">
                <div className="flex items-center">
                    {currentIndex > 0 && (
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handlePriorityUp}>
                            <ArrowUp className="h-5 w-5 text-add-green" />
                        </Button>
                    )}
                    {currentIndex < jobs.length - 1 && (
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handlePriorityDown}>
                            <ArrowDown className="h-5 w-5 text-add-red" />
                        </Button>
                    )}
                </div>
            </Can>
        </div>
    );
};