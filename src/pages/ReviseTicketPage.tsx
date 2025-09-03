import { useNavigate, useParams } from "react-router-dom";
import { useCreateTicket, useCreateTicketActions } from "../store/createTicketStore";
import { useAuthStore } from "../store/authStore";
import { useToast } from "../hooks/useToast";
import { useEffect } from "react";
import { Panel } from "../components/ui/Panel";
import { Button } from "../components/ui/Button";
import { Text } from "../components/ui/Text";
import { ArrowLeft } from "lucide-react";
import { CreateTicketForm } from "../components/features/ticket/CreateTicketForm";
import type { UploadedFile } from "../components/ui/FileInput";

const API_BASE_URL = '/api/e-memo-job-reservation';

export default function ReviseTicketPage() {
    const { id } = useParams<{ id: string }>();
    const { status, formData } = useCreateTicket();
    const { fetchInitialData, setFormField, reset } = useCreateTicketActions();
    const accessToken = useAuthStore((state) => state.accessToken);
    const navigate = useNavigate();
    const toast = useToast();

    useEffect(() => {
        const loadData = async () => {
            await fetchInitialData();
            if (!id) return;
            try {
                const [ticketRes, filesRes] = await Promise.all([
                    fetch(`${API_BASE_URL}/tickets/${id}`, {
                        headers: { Authorization: `Bearer ${accessToken}` },
                    }),
                    fetch(`${API_BASE_URL}/tickets/${id}/files`, {
                        headers: { Authorization: `Bearer ${accessToken}` },
                    }),
                ]);

                if (!ticketRes.ok || !filesRes.ok) throw new Error('Failed to fetch ticket data');

                const ticketData = await ticketRes.json();
                const filesData = await filesRes.json();

                setFormField('department_target_id', ticketData.data.department_target_id);
                setFormField('description', ticketData.data.description);
                setFormField('physical_location_id', ticketData.data.physical_location_id?.Int64);
                setFormField('specified_location_id', ticketData.data.specified_location_id?.Int64);
                if (ticketData.data.deadline?.Valid) {
                    setFormField('deadline', new Date(ticketData.data.deadline.Time));
                }
                const existingFiles: UploadedFile[] = [
                    ...(filesData.data.support_files || []),
                    ...(filesData.data.report_files || []),
                ].map(file => ({
                    name: file.file_name,
                    size: file.file_size,
                    url: `${API_BASE_URL}/files/view?path=${encodeURIComponent(file.file_path)}`,
                }));

                setFormField('support_files', existingFiles);
            } catch (error) {
                toast.error('Gagal memuat data tiket untuk revisi.');
            }
        };
        loadData();
        return () => reset();
    }, [id, fetchInitialData, setFormField, reset, accessToken, toast]);

    const handleRevise = async () => {
        console.log('Revising ticket with data:', formData);
        toast.info('Fungsi revisi belum diimplementasikan.');
    };

    return (
        <Panel shadow="s-400">
            <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                    <Button variant="secondary" size="sm" className="h-10 w-10 p-0" onClick={() => navigate(-1)}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <Text as="h1" variant="heading-xl" weight="bold">
                        Revisi Tiket #{id}
                    </Text>
                </div>

                {status === 'loading' && <Text className="text-center">Memuat data form...</Text>}
                {status === 'error' && <Text color="add-red" className="text-center">Gagal memuat data.</Text>}

                {status !== 'loading' && <CreateTicketForm />}

                <div className="flex justify-end gap-4 border-t pt-4">
                    <Button variant="secondary" onClick={() => navigate(-1)}>
                        Batal
                    </Button>
                    <Button variant="primary-blue" onClick={handleRevise}>
                        Revisi
                    </Button>
                </div>
            </div>
        </Panel>
    );
}