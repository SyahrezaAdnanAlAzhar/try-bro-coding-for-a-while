import { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalFooter, ModalTitle } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { FormField } from '../../ui/FormField';
import { Text } from '../../ui/Text';

interface EditNameModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    initialValue: string;
    onSave: (newValue: string) => Promise<boolean>;
}

export const EditNameModal = ({ isOpen, onClose, title, initialValue, onSave }: EditNameModalProps) => {
    const [name, setName] = useState(initialValue);
    const [isLoading, setIsLoading] = useState(false);

    const handleSave = async () => {
        if (!name.trim() || name === initialValue) return;
        setIsLoading(true);
        const success = await onSave(name);
        setIsLoading(false);
        if (success) {
            onClose();
        }
    };

    return (
        <Modal open={isOpen} onOpenChange={onClose}>
            <ModalContent>
                <ModalHeader>
                    <ModalTitle>{title}</ModalTitle>
                </ModalHeader>
                <div className="space-y-4 py-4">
                    <Text>Nama Lama: <span className="font-bold">{initialValue}</span></Text>
                    <FormField
                        label="Masukkan Nama Baru"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <ModalFooter>
                    <Button variant="secondary" onClick={onClose}>Batal</Button>
                    <Button onClick={handleSave} isLoading={isLoading} disabled={!name.trim() || name === initialValue}>Simpan</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};