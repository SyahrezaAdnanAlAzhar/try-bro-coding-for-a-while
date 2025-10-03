import { useMasterData, useMasterDataActions, type PhysicalLocation } from '../../../store/masterDataStore';
import { Button } from '../../ui/Button';
import { ArrowLeft } from 'lucide-react';
import { CreateModal } from './CreateModal';
import { EditableCell } from './EditableCell';
import { ToggleCell } from './ToggleCell';

interface SpecifiedLocationTableProps {
    physicalLocation: PhysicalLocation;
    onBack: () => void;
}

const TableHeader = () => (
    <thead className="bg-mono-light-grey/70">
        <tr>
            <th className="px-4 py-3 text-left">ID</th>
            <th className="px-4 py-3 text-left">Nama Sub Area</th>
            <th className="px-4 py-3 text-center">Aktif</th>
        </tr>
    </thead>
);

export const SpecifiedLocationTable = ({ physicalLocation, onBack }: SpecifiedLocationTableProps) => {
    const { specifiedLocations, status } = useMasterData();
    const { createSpecifiedLocation, updateSpecifiedLocationName, updateSpecifiedLocationStatus } = useMasterDataActions();

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <Button variant="secondary" size="sm" onClick={onBack} leftIcon={<ArrowLeft size={16} />}>
                    Kembali ke Area Pabrik
                </Button>
                <CreateModal
                    title={`Tambah Sub Area di ${physicalLocation.name}`}
                    label="Nama Sub Area"
                    onSubmit={(name) => createSpecifiedLocation(physicalLocation.id, name)}
                />
            </div>
            <div className="overflow-x-auto rounded-lg border">
                <table className="min-w-full table-auto">
                    <TableHeader />
                    <tbody>
                        {status === 'loading' && <tr><td colSpan={3} className="p-4 text-center">Loading...</td></tr>}
                        {specifiedLocations.map(loc => (
                            <tr key={loc.id} className="border-b">
                                <td className="px-4 py-3">{loc.id}</td>
                                <td className="px-4 py-3">
                                    <EditableCell
                                        initialValue={loc.name}
                                        onSave={(newName) => updateSpecifiedLocationName(loc.id, physicalLocation.id, newName)}
                                        title="Ganti Nama Sub Area"
                                    />
                                </td>
                                <td className="px-4 py-3 text-center">
                                    <ToggleCell
                                        initialValue={loc.is_active}
                                        onToggle={(newValue) => updateSpecifiedLocationStatus(loc.id, physicalLocation.id, newValue)}
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