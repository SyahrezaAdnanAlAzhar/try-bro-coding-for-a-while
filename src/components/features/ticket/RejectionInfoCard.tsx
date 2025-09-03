import { useState, useEffect } from 'react';
import { useAuthStore } from '../../../store/authStore';
import { Panel } from '../../ui/Panel';
import { Text } from '../../ui/Text';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface RejectionData {
    reason: string;
    rejector_npk: string;
    rejector_name: string;
    rejector_position: string;
    rejector_department: string;
    rejected_at: string;
}

interface RejectionInfoCardProps {
    ticketId: number;
}

const API_BASE_URL = '/api/e-memo-job-reservation';

export const RejectionInfoCard = ({ ticketId }: RejectionInfoCardProps) => {
    const [rejectionData, setRejectionData] = useState<RejectionData | null>(null);
    const accessToken = useAuthStore((state) => state.accessToken);

    useEffect(() => {
        const fetchRejectionInfo = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/tickets/${ticketId}/last-rejection`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                if (!response.ok) return;
                const { data } = await response.json();
                setRejectionData(data);
            } catch (error) {
                console.error('Failed to fetch rejection info:', error);
            }
        };

        if (accessToken) {
            fetchRejectionInfo();
        }
    }, [ticketId, accessToken]);

    if (!rejectionData) {
        return null;
    }

    const formattedDate = format(new Date(rejectionData.rejected_at), 'd MMMM yyyy, HH:mm', { locale: id });

    return (
        <Panel
            padding="md"
            shadow="s-100"
            className="border-2 border-basic-yellow bg-basic-yellow-light"
        >
            <div className="space-y-2">
                <Text weight="bold" color="mono-black">Alasan Penolakan Terakhir:</Text>
                <Text as="p" className="italic">"{rejectionData.reason}"</Text>
                <Text variant="body-sm" color="mono-dark-grey" className="pt-2">
                    Ditolak oleh: {rejectionData.rejector_name} ({rejectionData.rejector_position}) pada {formattedDate}
                </Text>
            </div>
        </Panel>
    );
};