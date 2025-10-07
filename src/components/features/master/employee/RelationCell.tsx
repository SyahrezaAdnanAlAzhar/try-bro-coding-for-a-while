import { useState, useMemo } from 'react';
import { EditRelationModal } from './EditRelationModal';
import { Pencil } from 'lucide-react';
import type { ComboboxOption } from '../../../ui/Combobox';
import { Text } from '../../../ui/Text';

interface RelationCellProps {
    title: string;
    valueId: number | null;
    options: { id: number; name: string }[];
    onSave: (selectedOption: ComboboxOption | null) => Promise<boolean>;
}

export const RelationCell = ({ title, valueId, options, onSave }: RelationCellProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const comboboxOptions = useMemo(() => options.map(o => ({ value: o.id, label: o.name })), [options]);
    const currentValue = comboboxOptions.find(o => o.value === valueId) || null;

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="group flex items-center gap-2 text-left"
            >
                <Text>{currentValue?.label || '-'}</Text>
                <Pencil size={14} className="text-mono-grey opacity-0 transition-opacity group-hover:opacity-100" />
            </button>
            <EditRelationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={title}
                options={comboboxOptions}
                currentValue={currentValue}
                onSave={onSave}
            />
        </>
    );
};