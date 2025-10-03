import { useMemo } from 'react';
import { useCreateTicket, useCreateTicketActions } from '../../../store/createTicketStore';
import { FormField } from '../../ui/FormField';
import { Combobox, type ComboboxOption } from '../../ui/Combobox';
import { FileInput, type UploadedFile } from '../../ui/FileInput';
import { DatePicker } from '../../ui/DatePicker';
import 'react-day-picker/dist/style.css';
import { Text } from '../../ui/Text';
import { useAuthStore } from '../../../store/authStore';
import { useToast } from '../../../hooks/useToast';
import { CreatableCombobox } from '../../ui/CreatableCombobox';
import { apiClient } from '../../../lib/apiClient';

export const CreateTicketForm = () => {
    const { formData, options, errors } = useCreateTicket();
    const { setFormField, fetchSpecifiedLocations } = useCreateTicketActions();
    const accessToken = useAuthStore((state) => state.accessToken);
    const toast = useToast();

    const handleFileAction = async (file: UploadedFile, action: 'view' | 'download') => {
        if (!accessToken) return toast.error('Otentikasi dibutuhkan.');
        try {
            const response = await apiClient(file.url, {
            });
            if (!response.ok) throw new Error(`Gagal untuk ${action} file.`);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            if (action === 'view') {
                window.open(blobUrl, '_blank');
            } else {
                const a = document.createElement('a');
                a.href = blobUrl;
                a.download = file.name;
                document.body.appendChild(a);
                a.click();
                a.remove();
            }
            setTimeout(() => window.URL.revokeObjectURL(blobUrl), 100);
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    const departmentOptions: ComboboxOption[] = useMemo(
        () => options.departments.map((d) => ({ value: d.id, label: d.name })),
        [options.departments]
    );

    const physicalLocationOptions: ComboboxOption[] = useMemo(
        () => options.physicalLocations.map((l) => ({ value: l.id, label: l.name })),
        [options.physicalLocations]
    );

    const specifiedLocationOptions: ComboboxOption[] = useMemo(
        () => options.specifiedLocations.map((l) => ({ value: l.id, label: l.name })),
        [options.specifiedLocations]
    );

    const selectedSpecifiedLocation = useMemo(() => {
        const foundOption = options.specifiedLocations.find(l => l.name === formData.specified_location_name);
        if (foundOption) {
            return { value: foundOption.id, label: foundOption.name };
        }
        if (formData.specified_location_name) {
            return { value: formData.specified_location_name, label: formData.specified_location_name };
        }
        return null;
    }, [formData.specified_location_name, options.specifiedLocations]);

    // const handleFilesChange = useCallback(
    //     (files: (File | UploadedFile)[]) => {
    //         setFormField('support_files', files);
    //     },
    //     [setFormField]
    // );

    const selectedDepartment = departmentOptions.find(d => d.value === formData.department_target_id) || null;
    const selectedPhysicalLocation = physicalLocationOptions.find(l => l.value === formData.physical_location_id) || null;

    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Department */}
            <div className="md:col-span-2">
                <label className="mb-1 block text-base font-semibold text-blue-mtm-400">Department</label>
                <Combobox
                    options={departmentOptions}
                    value={selectedDepartment}
                    onChange={(option) => setFormField('department_target_id', option ? (option.value as number) : null)}
                    placeholder="Pilih department"
                />
                {errors.department_target_id && <Text variant="body-sm" color="add-red" className="mt-1">{errors.department_target_id}</Text>}
            </div>

            {/* Job Description */}
            <div className="md:col-span-2">
                <FormField
                    as="textarea"
                    label="Job Description"
                    value={formData.description}
                    onChange={(e) => setFormField('description', e.target.value)}
                    error={errors.description}
                    placeholder="Isi job description"
                    rows={4}
                />
            </div>

            {/* Lokasi Area */}
            <div>
                <label className="mb-1 block text-base font-semibold text-blue-mtm-400">Lokasi Area (Opsional)</label>
                <Combobox
                    options={physicalLocationOptions}
                    value={selectedPhysicalLocation}
                    onChange={(option) => {
                        const id = option ? (option.value as number) : null;
                        setFormField('physical_location_id', id);
                        if (id) fetchSpecifiedLocations(id);
                    }}
                    placeholder="Pilih Area"
                />
            </div>

            {/* Lokasi Sub Area */}
            <div>
                <label className="mb-1 block text-base font-semibold text-blue-mtm-400">Lokasi Sub Area (Opsional)</label>
                <CreatableCombobox
                    options={specifiedLocationOptions}
                    value={selectedSpecifiedLocation}
                    onChange={(option) => setFormField('specified_location_name', option ? option.label : '')}
                    onCreate={(newName) => setFormField('specified_location_name', newName)}
                    placeholder="Pilih atau buat baru..."
                    disabled={!formData.physical_location_id}
                />
            </div>

            {/* File Pendukung */}
            <div className="md:col-span-2">
                <FileInput
                    label="File Pendukung (Opsional)"
                    files={formData.support_files}
                    onFilesChange={(files) => setFormField('support_files', files)}
                    onViewFile={(file) => handleFileAction(file, 'view')}
                    onDownloadFile={(file) => handleFileAction(file, 'download')}
                    helpText="Anda bisa upload lebih dari satu file"
                    multiple
                />
            </div>

            {/* Deadline */}
            <div className="md:col-span-2">
                <label className="mb-1 block text-base font-semibold text-blue-mtm-400">Deadline (Opsional)</label>
                <DatePicker
                    value={formData.deadline}
                    onChange={(date) => setFormField('deadline', date || null)}
                />
            </div>
        </div>
    );
};