import { Text } from '../../../ui/Text';

interface SpendingAmountCellProps {
    amount: number | null;
}

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
};

export const SpendingAmountCell = ({ amount }: SpendingAmountCellProps) => {
    if (amount === null || amount === 0) {
        return <Text></Text>;
    }

    return <Text>{formatCurrency(amount)}</Text>;
};