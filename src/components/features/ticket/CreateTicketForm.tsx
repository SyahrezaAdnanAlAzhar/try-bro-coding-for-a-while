import { useMemo } from 'react';
import { useCreateTicket, useCreateTicketActions } from '../../../store/createTicketStore';
import { FormField } from '../../ui/FormField';
import { Combobox, type ComboboxOption } from '../../ui/Combobox';
import { FileInput } from '../../ui/FileInput';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { format } from 'date-fns';
import { Text } from '../../ui/Text';
import { DatePicker } from '../../ui/DatePicker';

export const CreateTicketForm = () => {
    const { formData, options, errors } = useCreateTicket();
    const { setFormField, fetchSpecifiedLocations } = useCreateTicketActions();

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

    const selectedDepartment = departmentOptions.find(d => d.value === formData.department_target_id) || null;
    const selectedPhysicalLocation = physicalLocationOptions.find(l => l.value === formData.physical_location_id) || null;
    const selectedSpecifiedLocation = specifiedLocationOptions.find(l => l.value === formData.specified_location_id) || null;

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

            {/* Lokasi Daerah */}
            <div>
                <label className="mb-1 block text-base font-semibold text-blue-mtm-400">Lokasi Daerah (Opsional)</label>
                <Combobox
                    options={specifiedLocationOptions}
                    value={selectedSpecifiedLocation}
                    onChange={(option) => setFormField('specified_location_id', option ? (option.value as number) : null)}
                    placeholder="Pilih Daerah"
                    disabled={!formData.physical_location_id || options.specifiedLocations.length === 0}
                />
            </div>

            {/* File Pendukung */}
            <div className="md:col-span-2">
                <FileInput
                    label="File Pendukung (Opsional)"
                    onFilesChange={(files) => setFormField('support_files', files as File[])}
                    helpText="Anda bisa upload lebih dari satu file"
                    multiple
                />
            </div>

            {/* Deadline */}
            <div className="md:col-span-2">
                <label className="mb-1 block text-base font-semibold text-blue-mtm-400">Deadline (Opsional)</label>
                <DatePicker
                    value={formData.deadline}
                    onChange={(date) => setFormField('deadline', date)}
                />
            </div>
        </div>
    );
};