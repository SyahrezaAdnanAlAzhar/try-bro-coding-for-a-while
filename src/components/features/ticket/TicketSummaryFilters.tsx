import { useEffect, useMemo } from 'react';
import { useTicketSummaryActions, useOldestYear, useTicketSummaryFilters } from '../../../store/ticketSummaryStore';
import { Combobox, type ComboboxOption } from '../../ui/Combobox';

const MONTHS: ComboboxOption[] = [
    { value: 1, label: 'Januari' },
    { value: 2, label: 'Februari' },
    { value: 3, label: 'Maret' },
    { value: 4, label: 'April' },
    { value: 5, label: 'Mei' },
    { value: 6, label: 'Juni' },
    { value: 7, label: 'Juli' },
    { value: 8, label: 'Agustus' },
    { value: 9, label: 'September' },
    { value: 10, label: 'Oktober' },
    { value: 11, label: 'November' },
    { value: 12, label: 'Desember' },
];

export const TicketSummaryFilters = () => {
    const { fetchOldestYear, setFilter } = useTicketSummaryActions();
    const oldestYear = useOldestYear();
    const filters = useTicketSummaryFilters();

    useEffect(() => {
        fetchOldestYear();
    }, [fetchOldestYear]);

    const yearOptions = useMemo(() => {
        if (!oldestYear) return [];
        const currentYear = new Date().getFullYear();
        const years: ComboboxOption[] = [];
        for (let year = currentYear; year >= oldestYear; year--) {
            years.push({ value: year, label: String(year) });
        }
        return years;
    }, [oldestYear]);

    const selectedMonth = MONTHS.find((m) => m.value === filters.month) || null;
    const selectedYear = yearOptions.find((y) => y.value === filters.year) || null;

    return (
        <div className="flex items-center gap-4">
            <Combobox
                options={MONTHS}
                value={selectedMonth}
                onChange={(option) => setFilter({ month: option ? (option.value as number) : null })}
                placeholder="Pilih Bulan"
                className="w-40"
            />
            <Combobox
                options={yearOptions}
                value={selectedYear}
                onChange={(option) => setFilter({ year: option ? (option.value as number) : null })}
                placeholder="Pilih Tahun"
                className="w-32"
            />
        </div>
    );
};