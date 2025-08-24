import { Can } from '../../../auth/Can';
import { Button } from '../../../ui/Button';
import { Text } from '../../../ui/Text';

interface JobPicCellProps {
    picName: string | null;
    jobId: number;
}

export const JobPicCell = ({ picName, jobId }: JobPicCellProps) => {
    const handleAssign = () => console.log(`Assign PIC for job ${jobId}`);

    if (picName) {
        return <Text>{picName.split(' ')[0]}</Text>;
    }

    return (
        <Can permission="JOB_ASSIGN_PIC">
            <Button size="base" variant="blue-mtm-dark" onClick={handleAssign}>
                Assign
            </Button>
        </Can>
    );
};