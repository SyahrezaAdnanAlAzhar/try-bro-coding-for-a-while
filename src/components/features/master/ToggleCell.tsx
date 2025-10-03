import { useState } from 'react';
import { Switch } from '../../ui/Switch';
import { useToast } from '../../../hooks/useToast';

interface ToggleCellProps {
    initialValue: boolean;
    onToggle: (newValue: boolean) => Promise<boolean>;
}

export const ToggleCell = ({ initialValue, onToggle }: ToggleCellProps) => {
    const [isChecked, setIsChecked] = useState(initialValue);
    const [isLoading, setIsLoading] = useState(false);
    const toast = useToast();

    const handleToggle = async (newValue: boolean) => {
        setIsLoading(true);
        const success = await onToggle(newValue);
        if (success) {
            setIsChecked(newValue);
            toast.success('Status berhasil diperbarui.');
        } else {
            toast.error('Gagal memperbarui status.');
            // Revert UI state on failure
            setIsChecked(!newValue);
        }
        setIsLoading(false);
    };

    return (
        <Switch
            checked={isChecked}
            onCheckedChange={handleToggle}
            disabled={isLoading}
        />
    );
};