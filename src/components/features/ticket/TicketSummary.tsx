import { useEffect } from 'react';
import { TicketSummaryBar } from './TicketSummaryBar';
import { TicketSummaryFilters } from './TicketSummaryFilters';
import { MessageBar } from '../../ui/MessageBar';
import { Text } from '../../ui/Text';
import { useSelectedDepartmentId } from '../../../store/departmentStore';
import { useTicketSummary, useTicketSummaryActions, useTicketSummaryFilters, useTicketSummaryStatus } from '../../../store/ticketSummaryStore';

export const TicketSummary = () => {
    const selectedDepartmentId = useSelectedDepartmentId();
    const filters = useTicketSummaryFilters();
    const summaryData = useTicketSummary();
    const status = useTicketSummaryStatus();
    const { fetchSummaryData } = useTicketSummaryActions();

    useEffect(() => {
        if (selectedDepartmentId) {
            fetchSummaryData({ departmentId: selectedDepartmentId });
        }
    }, [selectedDepartmentId, filters, fetchSummaryData]);

    const showYearWarning = filters.month !== null && filters.year === null;

    return (
        <div className="space-y-4">
            {showYearWarning && (
                <MessageBar variant="warning">
                    Harap pilih tahun untuk melihat data bulan yang spesifik.
                </MessageBar>
            )}

            <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg p-4">
                <div className="flex-grow">
                    <TicketSummaryBar data={summaryData} />
                </div>
                <div className="flex-shrink-0">
                    <TicketSummaryFilters />
                </div>
            </div>


            {status === 'loading' && <Text className="text-center">Loading summary...</Text>}
            {status === 'error' && <Text color="add-red" className="text-center">Failed to load summary.</Text>}
        </div>
    );
};