import { useMasterData, useMasterDataActions, type MasterDepartment } from '../../../store/masterDataStore';
import { Button } from '../../ui/Button';
import { ArrowLeft } from 'lucide-react';
import { CreateModal } from './CreateModal';
import { EditableCell } from './EditableCell';
import { ToggleCell } from './ToggleCell';

interface AreaTableProps {
    department: MasterDepartment;
    onBack: () => void;
}

const TableHeader = () => (
    <thead className="bg-mono-light-grey/70">
        <tr>
            <th className="px-4 py-3 text-left">ID</th>
            <th className="px-4 py-3 text-left">Nama Area</th>
            <th className="px-4 py-3 text-center">Aktif</th>
        </tr>
    </thead>
);

export const AreaTable = ({ department, onBack }: AreaTableProps) => {
    const { areas, status } = useMasterData();
    const { createArea, updateArea } = useMasterDataActions();

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <Button variant="secondary" size="sm" onClick={onBack} leftIcon={<ArrowLeft size={16} />}>
                    Kembali
                </Button>
                <CreateModal
                    title={`Tambah Area Baru di ${department.name}`}
                    label="Nama Area"
                    onSubmit={(name) => createArea(department.id, name)}
                />
            </div>
            <div className="overflow-x-auto rounded-lg border">
                <table className="min-w-full table-auto">
                    <TableHeader />
                    <tbody>
                        {status === 'loading' && <tr><td colSpan={3} className="p-4 text-center">Loading...</td></tr>}
                        {areas.map(area => (
                            <tr key={area.id} className="border-b">
                                <td className="px-4 py-3">{area.id}</td>
                                <td className="px-4 py-3">
                                    <EditableCell
                                        initialValue={area.name}
                                        onSave={(newName) => updateArea(area.id, { name: newName, department_id: department.id })}
                                        title="Ganti Nama Area"
                                    />
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <ToggleCell
                                        initialValue={area.is_active}
                                        onToggle={(newValue) => updateArea(area.id, { is_active: newValue, department_id: department.id })}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};