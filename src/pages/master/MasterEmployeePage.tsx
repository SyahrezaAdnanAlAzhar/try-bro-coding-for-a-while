import { useEffect } from 'react';
import { Text } from '../../components/ui/Text';
import { useMasterEmployee, useMasterEmployeeActions } from '../../store/masterEmployeeStore';
import { MasterEmployeeTable } from '../../components/features/master/employee/MasterEmployeeTable';
import { EmployeeToolbar } from '../../components/features/master/employee/EmployeeToolbar';
import { Pagination } from '../../components/ui/Pagination';

export default function MasterEmployeePage() {
    const { pagination } = useMasterEmployee();
    const { fetchEmployees, fetchOptions, setPage } = useMasterEmployeeActions();

    useEffect(() => {
        fetchOptions();
        fetchEmployees();
    }, [fetchEmployees, fetchOptions]);

    return (
        <div className="space-y-6">
            <Text as="h1" variant="display">
                Master Employee
            </Text>
            <div className="space-y-4">
                <EmployeeToolbar />
                <MasterEmployeeTable />
                <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={setPage}
                />
            </div>
        </div>
    );
}