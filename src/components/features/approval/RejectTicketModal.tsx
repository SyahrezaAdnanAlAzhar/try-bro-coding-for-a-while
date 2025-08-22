import { useState } from 'react';

import { PrebuiltActionButton } from '../actions/PrebuiltActionButton';
import { Modal, ModalContent, ModalFooter, ModalHeader, ModalTitle, ModalTrigger } from '../../ui/Modal';
import { FormField } from '../../ui/FormField';
import { Button } from '../../ui/Button';

interface RejectTicketModalProps {
    ticketId: number;
    onConfirm: (reason: string) => void;
}

export const RejectTicketModal = ({ ticketId, onConfirm }: RejectTicketModalProps) => {
    const [open, setOpen] = useState(false);
    const [reason, setReason] = useState('');

    const handleSubmit = () => {
        if (reason.trim()) {
            onConfirm(reason);
            setOpen(false);
        }
    };

    return (
        <Modal open={open} onOpenChange={setOpen}>
            <ModalTrigger asChild>
                <PrebuiltActionButton actionName="Tolak" size="base" />
            </ModalTrigger>
            <ModalContent>
                <ModalHeader>
                    <ModalTitle>Tolak Tiket #{ticketId}</ModalTitle>
                </ModalHeader>
                <div className="py-4">
                    <FormField
                        as="textarea"
                        label="Alasan Penolakan"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Berikan alasan mengapa tiket ini ditolak..."
                        rows={4}
                        required
                    />
                </div>
                <ModalFooter>
                    <Button variant="secondary" onClick={() => setOpen(false)}>
                        Batal
                    </Button>
                    <PrebuiltActionButton
                        actionName="Tolak"
                        onClick={handleSubmit}
                        disabled={!reason.trim()}
                    />
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};