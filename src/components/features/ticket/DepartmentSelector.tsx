import { useDepartments, useSelectedDepartmentId, useDepartmentActions } from '../../../store/departmentStore';
import { Button } from '../../ui/Button';

export const DepartmentSelector = () => {
    const departments = useDepartments();
    const selectedId = useSelectedDepartmentId();
    const { setSelectedDepartment } = useDepartmentActions();

    if (!departments || departments.length === 0) {
        return null; 
    }

    return (
        <div className="flex flex-wrap gap-x-[6.66vw] sm:gap-x-8 gap-y-4">
            {departments.map((department) => (
                <Button
                    key={department.id}
                    onClick={() => setSelectedDepartment(department.id)}
                    variant={selectedId === department.id ? 'blue-mtm-dark' : 'secondary'}
                    size="base"
                    className="min-w-[120px] flex-grow sm:flex-grow-0"
                >
                    {department.name}
                </Button>
            ))}
        </div>
    );
};