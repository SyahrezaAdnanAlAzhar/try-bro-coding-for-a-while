import { useEffect, useState } from 'react';
import { Text } from '../../components/ui/Text';
import { useMasterDataActions, type MasterDepartment } from '../../store/masterDataStore';
import { DepartmentTable } from '../../components/features/master/DepartmentTable';
import { AreaTable } from '../../components/features/master/AreaTable';

export default function MasterDepartmentPage() {
    const [view, setView] = useState<'departments' | 'areas'>('departments');
    const [selectedDepartment, setSelectedDepartment] = useState<MasterDepartment | null>(null);
    const { fetchDepartments, fetchAreas } = useMasterDataActions();

    useEffect(() => {
        if (view === 'departments') {
            fetchDepartments();
        } else if (view === 'areas' && selectedDepartment) {
            fetchAreas(selectedDepartment.id);
        }
    }, [view, selectedDepartment, fetchDepartments, fetchAreas]);

    const handleViewAreas = (department: MasterDepartment) => {
        setSelectedDepartment(department);
        setView('areas');
    };

    const handleBackToDepartments = () => {
        setSelectedDepartment(null);
        setView('departments');
    };

    return (
        <div className="space-y-6">
            {view === 'departments' ? (
                <>
                    <Text as="h1" variant="display">Master Department</Text>
                    <DepartmentTable onViewAreas={handleViewAreas} />
                </>
            ) : (
                <>
                    <Text as="h1" variant="display">
                        Area Karyawan: {selectedDepartment?.name}
                    </Text>
                    <AreaTable
                        department={selectedDepartment!}
                        onBack={handleBackToDepartments}
                    />
                </>
            )}
        </div>
    );
}