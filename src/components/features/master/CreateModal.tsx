import { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalFooter, ModalTitle, ModalTrigger } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { FormField } from '../../ui/FormField';
import { Plus } from 'lucide-react';

interface CreateModalProps {
    title: string;
    label: string;
    onSubmit: (name: string) => Promise<boolean>;
}

export const CreateModal = ({ title, label, onSubmit }: CreateModalProps) => {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        if (!name.trim()) return;
        setIsLoading(true);
        const success = await onSubmit(name);
        setIsLoading(false);
        if (success) {
            setOpen(false);
            setName('');
        }
    };

    return (
        <Modal open={open} onOpenChange={setOpen}>
            <ModalTrigger asChild>
                <Button leftIcon={<Plus size={16} />}>Tambah</Button>
            </ModalTrigger>
            <ModalContent>
                <ModalHeader>
                    <ModalTitle>{title}</ModalTitle>
                </ModalHeader>
                <div className="py-4">
                    <FormField
                        label={label}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={`Masukkan ${label.toLowerCase()}...`}
                    />
                </div>
                <ModalFooter>
                    <Button variant="secondary" onClick={() => setOpen(false)}>Batal</Button>
                    <Button onClick={handleSubmit} isLoading={isLoading} disabled={!name.trim()}>Simpan</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};