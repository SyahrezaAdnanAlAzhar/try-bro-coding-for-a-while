import { useState, useEffect, useMemo } from 'react';
import { useAuthStore } from '../../../store/authStore';
import { useDepartmentStore } from '../../../store/departmentStore';
import { Modal, ModalContent, ModalHeader, ModalFooter, ModalTitle, ModalTrigger } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { Combobox, type ComboboxOption } from '../../ui/Combobox';
import { Text } from '../../ui/Text';
import { HTTP_BASE_URL } from '../../../config/api';

interface Employee {
    npk: string;
    name: string;
}

interface AssignPicModalProps {
    jobId: number;
    jobDescription: string;
    onConfirm: (picNpk: string) => void;
    children: React.ReactNode;
}

export const AssignPicModal = ({ jobDescription, onConfirm, children }: AssignPicModalProps) => {
    const [open, setOpen] = useState(false);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [selectedPic, setSelectedPic] = useState<ComboboxOption | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const user = useAuthStore((state) => state.user);
    const departments = useDepartmentStore((state) => state.departments);
    const accessToken = useAuthStore((state) => state.accessToken);

    useEffect(() => {
        if (open && user?.employee_department) {
            const fetchEmployees = async () => {
                setIsLoading(true);
                const userDepartment = departments.find(
                    (dep) => dep.name.toUpperCase() === user.employee_department.toUpperCase()
                );

                if (!userDepartment) {
                    setIsLoading(false);
                    return;
                }

                try {
                    const response = await fetch(
                        `${HTTP_BASE_URL}/employee?department_id=${userDepartment.id}&is_active=true`,
                        {
                            headers: { Authorization: `Bearer ${accessToken}` },
                        }
                    );
                    if (!response.ok) throw new Error('Failed to fetch employees');
                    const { data } = await response.json();
                    setEmployees(data);
                } catch (error) {
                    console.error(error);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchEmployees();
        }
    }, [open, user?.employee_department, departments, accessToken]);

    const employeeOptions: ComboboxOption[] = useMemo(
        () => employees.map((emp) => ({
            value: emp.npk,
            label: `${emp.npk} - ${emp.name}`,
        })),
        [employees]
    );

    const handleSubmit = () => {
        if (selectedPic) {
            onConfirm(selectedPic.value as string);
            setOpen(false);
            setSelectedPic(null);
        }
    };

    return (
        <Modal open={open} onOpenChange={setOpen}>
            <ModalTrigger asChild>{children}</ModalTrigger>
            <ModalContent>
                <ModalHeader>
                    <ModalTitle>Assign PIC Job</ModalTitle>
                    <Text color="mono-dark-grey" className="mt-1">
                        Job Desc: <span className="font-semibold">{jobDescription}</span>
                    </Text>
                </ModalHeader>
                <div className="py-4">
                    <Combobox
                        options={employeeOptions}
                        value={selectedPic}
                        onChange={setSelectedPic}
                        placeholder={isLoading ? 'Loading employees...' : 'Pilih PIC'}
                        disabled={isLoading}
                    />
                </div>
                <ModalFooter>
                    <Button variant="secondary" onClick={() => setOpen(false)}>
                        Batal
                    </Button>
                    <Button
                        variant="blue-mtm-dark"
                        onClick={handleSubmit}
                        disabled={!selectedPic}
                    >
                        Assign
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};