import { useEffect } from 'react';
import { Text } from '../components/ui/Text';
import { useJobActions } from '../store/jobStore';
import { JobToolbar } from '../components/features/job/JobToolbar';
import { JobTable } from '../components/features/job/table/JobTable';

export default function JobPage() {
    const { fetchJobs } = useJobActions();

    useEffect(() => {
        fetchJobs();
    }, [fetchJobs]);

    return (
        <div className="space-y-6">
            <Text as="h1" variant="display" weight="bold">
                Dashboard Job
            </Text>
            <div className="space-y-4">
                <JobToolbar />
                <JobTable />
            </div>
        </div>
    );
}