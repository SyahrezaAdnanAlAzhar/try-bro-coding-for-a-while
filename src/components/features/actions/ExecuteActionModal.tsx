import { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalFooter, ModalTitle, ModalTrigger } from '../../ui/Modal';
import { Button } from '../../ui/Button';
import { FormField } from '../../ui/FormField';
import { FileInput } from '../../ui/FileInput';
import { PrebuiltActionButton } from './PrebuiltActionButton';
import { Text } from '../../ui/Text';

export interface AvailableAction {
    action_name: string;
    hex_code: string;
    require_reason: boolean;
    reason_label: string | null;
    require_file: boolean;
}

interface ExecuteActionModalProps {
    jobDescription: string;
    action: AvailableAction;
    onConfirm: (formData: FormData) => void;
    isLoading: boolean;
}

export const ExecuteActionModal = ({ jobDescription, action, onConfirm, isLoading }: ExecuteActionModalProps) => {
    const [open, setOpen] = useState(false);
    const [reason, setReason] = useState('');
    const [files, setFiles] = useState<File[]>([]);

    const handleSubmit = () => {
        const body = new FormData();
        body.append('ActionName', action.action_name);
        if (action.require_reason) {
            body.append('Reason', reason);
        }
        if (action.require_file) {
            files.forEach(file => body.append('Files', file));
        }
        onConfirm(body);
        setOpen(false);
    };

    const isSubmitDisabled =
        isLoading ||
        (action.require_reason && !reason.trim()) ||
        (action.require_file && files.length === 0);

    return (
        <Modal open={open} onOpenChange={setOpen}>
            <ModalTrigger asChild>
                <PrebuiltActionButton actionName={action.action_name} size="sm" />
            </ModalTrigger>
            <ModalContent>
                <ModalHeader>
                    <ModalTitle>Lengkapi yang Di Bawah Ini untuk "{action.action_name}"</ModalTitle>
                    <Text color="mono-dark-grey" className="mt-1 text-left">
                        Job Desc: <span className="font-semibold">{jobDescription}</span>
                    </Text>
                </ModalHeader>
                <div className="space-y-4 py-4">
                    {action.require_reason && (
                        <FormField
                            as="textarea"
                            label={action.reason_label || 'Alasan'}
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            rows={4}
                            required
                        />
                    )}
                    {action.require_file && (
                        <FileInput
                            label="Unggah berkas pendukung"
                            onFilesChange={(uploadedFiles) => setFiles(uploadedFiles as File[])}
                            multiple
                        />
                    )}
                </div>
                <ModalFooter>
                    <Button variant="secondary" onClick={() => setOpen(false)}>
                        Batal
                    </Button>
                    <PrebuiltActionButton
                        actionName={action.action_name}
                        onClick={handleSubmit}
                        disabled={isSubmitDisabled}
                        isLoading={isLoading}
                    />
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};