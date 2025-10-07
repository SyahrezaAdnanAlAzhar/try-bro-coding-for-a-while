import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import type { Employee, EmployeeOption } from '../../../../types/api';
import { useMasterEmployee, useMasterEmployeeActions } from '../../../../store/masterEmployeeStore';
import { Combobox, type ComboboxOption } from '../../../ui/Combobox';
import { Modal, ModalContent, ModalFooter, ModalHeader, ModalTitle, ModalTrigger } from '../../../ui/Modal';
import { Button } from '../../../ui/Button';
import { FormField } from '../../../ui/FormField';

type Mode = 'create' | 'edit';

interface CreateEditEmployeeModalProps {
    mode: Mode;
    employee?: Employee;
}

export const CreateEditEmployeeModal = ({ mode, employee }: CreateEditEmployeeModalProps) => {
    const [open, setOpen] = useState(false);
    const { options } = useMasterEmployee();
    const { createEmployee, updateEmployee, fetchAreasForDepartment } = useMasterEmployeeActions();

    const [formData, setFormData] = useState({
        npk: employee?.npk || '',
        name: employee?.name || '',
        department_id: employee?.department_id || null,
        area_id: employee?.area_id?.Valid ? employee.area_id.Int64 : null,
        employee_position_id: employee?.position.id || null,
    });

    useEffect(() => {
        if (open && formData.department_id) {
            fetchAreasForDepartment(formData.department_id);
        }
    }, [open, formData.department_id, fetchAreasForDepartment]);

    const handleChange = (field: keyof typeof formData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (field === 'department_id') {
            setFormData(prev => ({ ...prev, area_id: null }));
        }
    };

    const handleSubmit = async () => {
        const success = mode === 'create'
            ? await createEmployee(formData)
            : await updateEmployee(employee!.npk, formData);
        if (success) setOpen(false);
    };

    const toComboboxOption = (items: EmployeeOption[]): ComboboxOption[] => items.map(i => ({ value: i.id, label: i.name }));

    return (
        <Modal open={open} onOpenChange={setOpen}>
            <ModalTrigger asChild>
                {mode === 'create' ? (
                    <Button leftIcon={<Plus size={16} />}>Tambah Karyawan</Button>
                ) : (
                    <Button variant="secondary" size="sm">Edit</Button>
                )}
            </ModalTrigger>
            <ModalContent>
                <ModalHeader>
                    <ModalTitle>{mode === 'create' ? 'Tambah Karyawan Baru' : `Edit Karyawan: ${employee?.name}`}</ModalTitle>
                </ModalHeader>
                <div className="grid grid-cols-2 gap-4 py-4">
                    <FormField label="NPK" value={formData.npk} onChange={e => handleChange('npk', e.target.value)} disabled={mode === 'edit'} />
                    <FormField label="Nama" value={formData.name} onChange={e => handleChange('name', e.target.value)} />
                    <div>
                        <label>Departemen</label>
                        <Combobox options={toComboboxOption(options.departments)} value={toComboboxOption(options.departments).find(o => o.value === formData.department_id) || null} onChange={opt => handleChange('department_id', opt?.value)} />
                    </div>
                    <div>
                        <label>Area</label>
                        <Combobox options={toComboboxOption(options.areas)} value={toComboboxOption(options.areas).find(o => o.value === formData.area_id) || null} onChange={opt => handleChange('area_id', opt?.value)} disabled={!formData.department_id} />
                    </div>
                    <div className="col-span-2">
                        <label>Posisi</label>
                        <Combobox options={toComboboxOption(options.positions)} value={toComboboxOption(options.positions).find(o => o.value === formData.employee_position_id) || null} onChange={opt => handleChange('employee_position_id', opt?.value)} />
                    </div>
                </div>
                <ModalFooter>
                    <Button variant="secondary" onClick={() => setOpen(false)}>Batal</Button>
                    <Button onClick={handleSubmit}>Simpan</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};