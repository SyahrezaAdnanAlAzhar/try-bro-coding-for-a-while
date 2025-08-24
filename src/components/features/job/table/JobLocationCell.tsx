import { Text } from '../../../ui/Text';

interface JobLocationCellProps {
    physical: string | null;
    specified: string | null;
}

export const JobLocationCell = ({ physical, specified }: JobLocationCellProps) => {
    if (!physical && !specified) {
        return <Text>-</Text>;
    }
    if (physical && !specified) {
        return <Text weight="bold">{physical}</Text>;
    }
    return (
        <Text>
            <span className="font-bold">{physical}</span> - <span>{specified}</span>
        </Text>
    );
};