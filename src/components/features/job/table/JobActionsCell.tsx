import { Eye, ArrowUp, ArrowDown } from 'lucide-react';
import { Button } from '../../../ui/Button';
import { Can } from '../../../auth/Can';

interface JobActionsCellProps {
    jobId: number | null;
}

export const JobActionsCell = ({ jobId }: JobActionsCellProps) => {
    if (!jobId) return null;

    const handleView = () => console.log(`View job ${jobId}`);
    const handlePriorityUp = () => console.log(`Priority up for job ${jobId}`);
    const handlePriorityDown = () => console.log(`Priority down for job ${jobId}`);

    return (
        <div className="flex items-center justify-end gap-1">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handleView}>
                <Eye className="h-5 w-5 text-blue-mtm-500" />
            </Button>
            <Can permission="JOB_PRIORITY_MANAGE">
                <div className="flex items-center">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handlePriorityUp}>
                        <ArrowUp className="h-5 w-5 text-add-green" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={handlePriorityDown}>
                        <ArrowDown className="h-5 w-5 text-add-red" />
                    </Button>
                </div>
            </Can>
        </div>
    );
};