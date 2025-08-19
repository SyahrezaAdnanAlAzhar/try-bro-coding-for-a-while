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

        <div className="flex flex-wrap justify-around space-x-16">
            {departments.map((department) => (
                <Button
                    key={department.id}
                    onClick={() => setSelectedDepartment(department.id)}
                    variant={selectedId === department.id ? 'blue-mtm-dark' : 'secondary'}
                    size="base"
                    className="min-w-[160px] flex-1"
                >
                    {department.name}
                </Button>
            ))}
        </div>

    );
};