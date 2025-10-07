import { useState } from 'react';
import { Combobox, type ComboboxOption } from '../../../ui/Combobox';
import { Modal, ModalContent, ModalFooter, ModalHeader, ModalTitle } from '../../../ui/Modal';
import { Button } from '../../../ui/Button';

interface EditRelationModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    options: ComboboxOption[];
    currentValue: ComboboxOption | null;
    onSave: (selectedOption: ComboboxOption | null) => Promise<boolean>;
}

export const EditRelationModal = ({ isOpen, onClose, title, options, currentValue, onSave }: EditRelationModalProps) => {
    const [selectedValue, setSelectedValue] = useState<ComboboxOption | null>(currentValue);
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        setIsLoading(true);
        const success = await onSave(selectedValue);
        setIsLoading(false);
        if (success) onClose();
    };

    return (
        <Modal open={isOpen} onOpenChange={onClose}>
            <ModalContent>
                <ModalHeader>
                    <ModalTitle>{title}</ModalTitle>
                </ModalHeader>
                <div className="py-4">
                    <Combobox
                        options={options}
                        value={selectedValue}
                        onChange={setSelectedValue}
                    />
                </div>
                <ModalFooter>
                    <Button variant="secondary" onClick={onClose}>Batal</Button>
                    <Button onClick={handleSave} isLoading={isLoading}>Simpan</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};