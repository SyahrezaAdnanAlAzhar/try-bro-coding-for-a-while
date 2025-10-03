import { useState } from 'react';
import { Text } from '../../ui/Text';
import { EditNameModal } from './EditNameModal';
import { Pencil } from 'lucide-react';

interface EditableCellProps {
    initialValue: string;
    onSave: (newValue: string) => Promise<boolean>;
    title: string;
}

export const EditableCell = ({ initialValue, onSave, title }: EditableCellProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="group flex items-center gap-2 text-left"
            >
                <Text>{initialValue}</Text>
                <Pencil size={14} className="text-blue-mtm-500" />
            </button>
            <EditNameModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={title}
                initialValue={initialValue}
                onSave={onSave}
            />
        </>
    );
};