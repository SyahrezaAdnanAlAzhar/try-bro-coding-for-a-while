import { useState, useEffect } from 'react';
import { useMasterData, useMasterDataActions, type PhysicalLocation } from '../../../store/masterDataStore';
import { Button } from '../../ui/Button';
import { Text } from '../../ui/Text';
import { CreateModal } from './CreateModal';
import { EditableCell } from './EditableCell';
import { ToggleCell } from './ToggleCell';
import { HTTP_BASE_URL } from '../../../config/api';

interface PhysicalLocationTableProps {
    onViewSpecified: (location: PhysicalLocation) => void;
}

const SubAreaList = ({ physicalLocationId }: { physicalLocationId: number }) => {
    const [subAreas, setSubAreas] = useState<{ name: string }[]>([]);
    useEffect(() => {
        const fetchSubAreas = async () => {
            try {
                const res = await fetch(`${HTTP_BASE_URL}/specified-location?physical_location_id=${physicalLocationId}`);
                const { data } = await res.json();
                setSubAreas(data || []);
            } catch (error) {
                console.error(error);
            }
        };
        fetchSubAreas();
    }, [physicalLocationId]);

    if (subAreas.length === 0) return <Text color="mono-grey">-</Text>;

    return (
        <ol className="list-decimal list-outside pl-5">
            {subAreas.map(area => (
                <li key={area.name} className="pl-1">
                    <Text variant="body-sm">{area.name}</Text>
                </li>
            ))}
        </ol>
    );
};

const TableHeader = () => (
    <thead className="bg-mono-light-grey/70">
        <tr>
            <th className="px-4 py-3 text-left">ID</th>
            <th className="px-4 py-3 text-left">Nama Area Pabrik</th>
            <th className="px-4 py-3 text-center">Aktif</th>
            <th className="px-4 py-3 text-left">Sub Area</th>
            <th className="px-4 py-3 text-right">Aksi</th>
        </tr>
    </thead>
);

export const PhysicalLocationTable = ({ onViewSpecified }: PhysicalLocationTableProps) => {
    const { physicalLocations, status } = useMasterData();
    const { createPhysicalLocation, updatePhysicalLocationName, updatePhysicalLocationStatus } = useMasterDataActions();

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <CreateModal
                    title="Tambah Area Pabrik Baru"
                    label="Nama Area Pabrik"
                    onSubmit={createPhysicalLocation}
                />
            </div>
            <div className="overflow-x-auto rounded-lg border">
                <table className="min-w-full table-auto">
                    <TableHeader />
                    <tbody>
                        {status === 'loading' && <tr><td colSpan={5} className="p-4 text-center">Loading...</td></tr>}
                        {physicalLocations.map(loc => (
                            <tr key={loc.id} className="border-b">
                                <td className="px-4 py-3 align-top">{loc.id}</td>
                                <td className="px-4 py-3 align-top">
                                    <EditableCell
                                        initialValue={loc.name}
                                        onSave={(newName) => updatePhysicalLocationName(loc.id, newName)}
                                        title="Ganti Nama Area Pabrik"
                                    />
                                </td>
                                <td className="px-4 py-3 text-center align-top">
                                    <ToggleCell
                                        initialValue={loc.is_active}
                                        onToggle={(newValue) => updatePhysicalLocationStatus(loc.id, newValue)}
                                    />
                                </td>
                                <td className="px-4 py-3 align-top">
                                    <SubAreaList physicalLocationId={loc.id} />
                                </td>
                                <td className="px-4 py-3 text-right align-top">
                                    <Button variant="secondary" size="sm" onClick={() => onViewSpecified(loc)}>
                                        Edit Sub Area
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};