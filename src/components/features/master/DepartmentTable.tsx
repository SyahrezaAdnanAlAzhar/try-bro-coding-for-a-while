import { useEffect, useState } from "react";
import { type MasterDepartment, useMasterData, useMasterDataActions } from "../../../store/masterDataStore";
import { Button } from '../../ui/Button';
import { Text } from '../../ui/Text';
import { CreateModal } from "./CreateModal";
import { EditableCell } from "./EditableCell";
import { ToggleCell } from "./ToggleCell";
import { HTTP_BASE_URL } from "../../../config/api";

interface DepartmentTableProps {
    onViewAreas: (department: MasterDepartment) => void;
}

const AreaList = ({ departmentId }: { departmentId: number }) => {
    const [areas, setAreas] = useState<{ name: string }[]>([]);
    useEffect(() => {
        const fetchDeptAreas = async () => {
            try {
                const res = await fetch(`${HTTP_BASE_URL}/areas?department_id=${departmentId}`);
                const { data } = await res.json();
                setAreas(data || []);
            } catch (error) {
                console.error(error);
            }
        };
        fetchDeptAreas();
    }, [departmentId]);

    if (areas.length === 0) return <Text color="mono-grey">-</Text>;

    return (
        <ol className="list-decimal list-outside pl-5">
            {areas.map(area => (
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
            <th className="w-16 px-4 py-3 text-left">ID</th>
            <th className="w-1/4 px-4 py-3 text-left">Nama Department</th>
            <th className="w-32 px-4 py-3 text-center">Menerima Job</th>
            <th className="w-32 px-4 py-3 text-center">Aktif</th>
            <th className="px-4 py-3 text-left">Area Karyawan</th>
            <th className="w-40 px-4 py-3 text-right">Aksi</th>
        </tr>
    </thead>
);

export const DepartmentTable = ({ onViewAreas }: DepartmentTableProps) => {
    const { departments, status } = useMasterData();
    const { createDepartment, updateDepartment } = useMasterDataActions();

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <CreateModal
                    title="Tambah Department Baru"
                    label="Nama Department"
                    onSubmit={createDepartment}
                />
            </div>
            <div className="overflow-x-auto rounded-lg border">
                <table className="min-w-full table-fixed">
                    <TableHeader />
                    <tbody>
                        {status === 'loading' && <tr><td colSpan={6} className="p-4 text-center">Loading...</td></tr>}
                        {departments.map(dept => (
                            <tr key={dept.id} className="border-b">
                                <td className="px-4 py-3 align-top">{dept.id}</td>
                                <td className="px-4 py-3 align-top">
                                    <EditableCell
                                        initialValue={dept.name}
                                        onSave={(newName) => updateDepartment(dept.id, { name: newName })}
                                        title="Ganti Nama Department"
                                    />
                                </td>
                                <td className="px-4 py-3 text-center align-top">
                                    <ToggleCell
                                        initialValue={dept.receive_job}
                                        onToggle={(newValue) => updateDepartment(dept.id, { receive_job: newValue })}
                                    />
                                </td>
                                <td className="px-4 py-3 text-center align-top">
                                    <ToggleCell
                                        initialValue={dept.is_active}
                                        onToggle={(newValue) => updateDepartment(dept.id, { is_active: newValue })}
                                    />
                                </td>
                                <td className="px-4 py-3 align-top">
                                    <AreaList departmentId={dept.id} />
                                </td>
                                <td className="px-4 py-3 text-right align-top">
                                    <Button variant="secondary" size="sm" onClick={() => onViewAreas(dept)}>
                                        Edit Area
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