import { useState } from 'react';
import { ShieldAlert } from 'lucide-react';
import { useIsEditModeActive } from '../store/realtimeStore';
import { useAuthUser } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { Text } from '../components/ui/Text';

export const EditModeOverlay = () => {
    const isSystemEditing = useIsEditModeActive();
    const user = useAuthUser();
    const [isDismissed, setIsDismissed] = useState(false);

    const isMasterUser = user?.user_type === 'master';
    const shouldShowOverlay = isSystemEditing && !isMasterUser && !isDismissed;

    const handleClose = () => {
        const confirmed = window.confirm(
            'Master User sedang melakukan perubahan data. Melanjutkan penggunaan aplikasi dapat menyebabkan inkonsistensi data. Apakah Anda yakin ingin melanjutkan?'
        );
        if (confirmed) {
            setIsDismissed(true);
        }
    };

    if (!shouldShowOverlay) {
        return null;
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="flex max-w-lg flex-col items-center gap-4 rounded-lg bg-mono-white p-8 text-center shadow-lg">
                <ShieldAlert className="h-16 w-16 text-add-dark-yellow" />
                <Text as="h2" variant="heading-lg" weight="bold">
                    Sistem dalam Mode Pemeliharaan
                </Text>
                <Text color="mono-dark-grey">
                    Admin sedang melakukan pembaruan pada sistem. Untuk sementara, beberapa fitur seperti membuat atau mengubah data dinonaktifkan untuk memastikan integritas data.
                </Text>
                <Button variant="secondary" onClick={handleClose} className="mt-4">
                    Saya Mengerti, Lanjutkan
                </Button>
            </div>
        </div>
    );
};