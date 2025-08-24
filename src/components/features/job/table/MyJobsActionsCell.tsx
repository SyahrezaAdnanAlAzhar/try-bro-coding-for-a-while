import { Eye } from 'lucide-react';
import { Button } from '../../../ui/Button';

interface MyJobsActionsCellProps {
    jobId: number | null;
}

export const MyJobsActionsCell = ({ jobId }: MyJobsActionsCellProps) => {
    if (!jobId) return null;

    const handleView = () => console.log(`View job ${jobId}`);
    const handleStartWork = () => console.log(`Start work on job ${jobId}`);

    return (
        <div className="flex items-center justify-end gap-2">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleView}>
                <Eye className="h-5 w-5 text-blue-mtm-500" />
            </Button>
            <Button
                variant="blue-mtm-light"
                size="sm"
                onClick={handleStartWork}
            >
                Mulai Kerjakan
            </Button>
        </div>
    );
};