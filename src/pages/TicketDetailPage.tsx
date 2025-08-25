import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { type Ticket } from '../types/api';
import { Panel } from '../components/ui/Panel';
import { Text } from '../components/ui/Text';
import { TicketDetailView } from '../components/features/ticket/TicketDetailView';

const API_BASE_URL = '/api/e-memo-job-reservation';

export default function TicketDetailPage() {
    const { id } = useParams<{ id: string }>();
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const accessToken = useAuthStore((state) => state.accessToken);

    useEffect(() => {
        if (!id) return;
        const fetchTicket = async () => {
            setStatus('loading');
            try {
                // Asumsi endpoint GET /tickets/{id} ada dan memerlukan auth
                const response = await fetch(`${API_BASE_URL}/tickets/${id}`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                if (!response.ok) throw new Error('Failed to fetch ticket details');
                const { data } = await response.json();
                setTicket(data);
                setStatus('success');
            } catch (error) {
                console.error(error);
                setStatus('error');
            }
        };
        fetchTicket();
    }, [id, accessToken]);

    return (
        <Panel shadow="s-400">
            <div className="flex flex-col gap-6">
                <Text as="h1" variant="heading-xl" weight="bold">
                    Detail Tiket #{id}
                </Text>

                {status === 'loading' && <Text className="text-center">Loading details...</Text>}
                {status === 'error' && <Text color="add-red" className="text-center">Gagal memuat detail tiket.</Text>}
                {status === 'success' && ticket && <TicketDetailView ticket={ticket} />}
            </div>
        </Panel>
    );
}