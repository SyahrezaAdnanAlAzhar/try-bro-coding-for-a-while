import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { type Ticket } from '../types/api';
import { Panel } from '../components/ui/Panel';
import { Text } from '../components/ui/Text';
import { TicketDetailView } from '../components/features/ticket/TicketDetailView';
import { Button } from '../components/ui/Button';
import { ArrowLeft } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { RejectionInfoCard } from '../components/features/ticket/RejectionInfoCard';

const API_BASE_URL = '/api/e-memo-job-reservation';

export default function TicketDetailPage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [ticket, setTicket] = useState<Ticket | null>(null);
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const accessToken = useAuthStore((state) => state.accessToken);

    const fetchTicket = useCallback(async () => {
        if (!id) return;
        setStatus('loading');
        try {
            const response = await fetch(`${API_BASE_URL}/tickets/${id}`);
            if (!response.ok) throw new Error('Failed to fetch ticket details');
            const { data } = await response.json();
            setTicket(data);
            setStatus('success');
        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    }, [id, accessToken]);

    useEffect(() => {
        fetchTicket();
    }, [fetchTicket]);

    return (
        <Panel shadow="s-400">
            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                    <Button
                        variant="secondary"
                        size="sm"
                        className="h-10 w-10 p-0"
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <Text as="h1" variant="heading-xl" weight="bold">
                        Detail Tiket #{id}
                    </Text>
                </div>
                {id && <RejectionInfoCard ticketId={parseInt(id, 10)} />}

                {status === 'loading' && <Text className="text-center">Loading details...</Text>}
                {status === 'error' && <Text color="add-red" className="text-center">Gagal memuat detail tiket.</Text>}
                {status === 'success' && ticket && (
                    <TicketDetailView ticket={ticket} onActionSuccess={fetchTicket} />
                )}
            </div>
        </Panel>
    );
}