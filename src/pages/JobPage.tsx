import { useEffect, useState } from 'react';
import { Text } from '../components/ui/Text';
import { useJobActions, useMyJobsStatus } from '../store/jobStore';
import { JobToolbar } from '../components/features/job/JobToolbar';
import { JobTable } from '../components/features/job/table/JobTable';
import { useAuthUser } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { MyJobsTable } from '../components/features/job/table/MyJobsTable';

type JobView = 'all' | 'my';

export default function JobPage() {
    const [activeView, setActiveView] = useState<JobView>('all');
    const { fetchJobs, fetchMyJobs } = useJobActions();
    const myJobsStatus = useMyJobsStatus();
    const user = useAuthUser();

    useEffect(() => {
        fetchJobs();
    }, [fetchJobs]);

    useEffect(() => {
        if (activeView === 'my' && myJobsStatus === 'idle') {
            fetchMyJobs();
        }
    }, [activeView, myJobsStatus, fetchMyJobs]);

    return (
        <div className="space-y-6 text-center">
            <Text as="h1" variant="display" weight="bold">
                Dashboard Job {user?.employee_department || ''}
            </Text>


            <div className="flex flex-wrap justify-around space-x-16 px-24">
                <Button
                    onClick={() => setActiveView('all')}
                    variant={activeView === 'all' ? 'blue-mtm-dark' : 'secondary'}
                    size="base"
                    className="flex-1"
                >
                    Seluruh Job
                </Button>
                <Button
                    onClick={() => setActiveView('my')}
                    variant={activeView === 'my' ? 'blue-mtm-dark' : 'secondary'}
                    size="base"
                    className="flex-1"
                >
                    Job Saya
                </Button>
            </div>

            <div className="space-y-4">
                <JobToolbar />
                {activeView === 'all' ? <JobTable /> : <MyJobsTable />}
            </div>
        </div>
    );
}