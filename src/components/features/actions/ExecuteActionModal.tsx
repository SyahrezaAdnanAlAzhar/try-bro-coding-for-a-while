import { useState } from 'react';
import { Modal, ModalContent, ModalHeader, ModalFooter, ModalTitle, ModalTrigger } from '../../ui/Modal';
import { Button, type ButtonProps } from '../../ui/Button';
import { FormField } from '../../ui/FormField';
import { FileInput, type UploadedFile } from '../../ui/FileInput';
import { CustomCurrencyInput } from '../../ui/CurrencyInput';
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
    buttonSize?: ButtonProps['size'];
    fullWidth?: boolean;
}

export const ExecuteActionModal = ({ jobDescription, action, onConfirm, isLoading, buttonSize, fullWidth, }: ExecuteActionModalProps) => {
    const [open, setOpen] = useState(false);
    const [reason, setReason] = useState('');
    const [files, setFiles] = useState<(File | UploadedFile)[]>([]);
    const [spendingAmount, setSpendingAmount] = useState<number | undefined>(0);

    const handleSubmit = () => {
        const body = new FormData();
        body.append('ActionName', action.action_name);
        if (action.require_reason) {
            body.append('Reason', reason);
        }
        if (action.require_file) {
            files.forEach(file => {
                if (file instanceof File) {
                    body.append('Files', file);
                }
            });
        }
        if (action.action_name === 'Selesaikan Job' && spendingAmount && spendingAmount > 0) {
            body.append('spending_amount', String(spendingAmount));
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
                <PrebuiltActionButton
                    actionName={action.action_name}
                    size={buttonSize}
                    fullWidth={fullWidth}
                />
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
                    {action.action_name === 'Selesaikan Job' && (
                        <div>
                            <label className="mb-1 block text-base font-semibold text-blue-mtm-400">
                                Biaya Pengeluaran (Opsional)
                            </label>
                            <CustomCurrencyInput
                                value={spendingAmount}
                                onValueChange={(value) => setSpendingAmount(value ? Number(value) : 0)}
                            />
                        </div>
                    )}
                    {action.require_file && (
                        <FileInput
                            label="Unggah berkas pendukung"
                            files={files}
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
                        size={buttonSize}
                        onClick={handleSubmit}
                        disabled={isSubmitDisabled}
                        isLoading={isLoading}
                    />
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};