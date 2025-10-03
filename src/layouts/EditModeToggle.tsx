import { useState } from 'react';
import { useIsEditModeActive, useRealtimeActions } from '../store/realtimeStore';
import { useToast } from '../hooks/useToast';
import { HTTP_BASE_URL } from '../config/api';
import { Switch } from '../components/ui/Switch';
import { Text } from '../components/ui/Text';
import { apiClient } from '../lib/apiClient';

export const EditModeToggle = () => {
    const isEditModeActive = useIsEditModeActive();
    const { setEditMode } = useRealtimeActions();
    const toast = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleToggle = async (checked: boolean) => {
        setIsSubmitting(true);
        try {
            const response = await apiClient(`${HTTP_BASE_URL}/system/edit-mode`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ is_editing: checked }),
            });

            if (!response.ok) throw new Error('Failed to update edit mode');

            setEditMode({ is_editing: checked });
            toast.success(`Mode Edit telah di-${checked ? 'aktifkan' : 'nonaktifkan'}.`);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex items-center gap-2">
            <Text variant="body-sm" weight="medium">Mode Edit</Text>
            <Switch
                checked={isEditModeActive}
                onCheckedChange={handleToggle}
                disabled={isSubmitting}
            />
        </div>
    );
};