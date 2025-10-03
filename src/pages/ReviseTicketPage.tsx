import { useNavigate, useParams } from "react-router-dom";
import { useCreateTicket, useCreateTicketActions } from "../store/createTicketStore";
import { useAuthStore } from "../store/authStore";
import { useToast } from "../hooks/useToast";
import { useEffect, useState } from "react";
import { Panel } from "../components/ui/Panel";
import { Button } from "../components/ui/Button";
import { Text } from "../components/ui/Text";
import { ArrowLeft } from "lucide-react";
import { CreateTicketForm } from "../components/features/ticket/CreateTicketForm";
import type { UploadedFile } from "../components/ui/FileInput";
import type { Ticket } from "../types/api";
import { format } from "date-fns";
import { RejectionInfoCard } from "../components/features/ticket/RejectionInfoCard";
import { HTTP_BASE_URL } from "../config/api";
import { apiClient } from "../lib/apiClient";

interface ApiFile {
    file_name: string;
    file_path: string;
    file_size: number;
    file_type: string;
    uploaded_at: string;
}

export default function ReviseTicketPage() {
    const { id } = useParams<{ id: string }>();
    const { status, formData } = useCreateTicket();
    const { fetchInitialData, setFormField, reset } = useCreateTicketActions();
    const accessToken = useAuthStore((state) => state.accessToken);
    const navigate = useNavigate();
    const toast = useToast();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [originalTicket, setOriginalTicket] = useState<Ticket | null>(null);
    const [originalFiles, setOriginalFiles] = useState<UploadedFile[]>([]);


    useEffect(() => {
        const loadData = async () => {
            await fetchInitialData();
            if (!id) return;
            try {
                const [ticketRes, filesRes] = await Promise.all([
                    fetch(`${HTTP_BASE_URL}/tickets/${id}`, {
                        headers: { Authorization: `Bearer ${accessToken}` },
                    }),
                    fetch(`${HTTP_BASE_URL}/tickets/${id}/files`, {
                        headers: { Authorization: `Bearer ${accessToken}` },
                    }),
                ]);

                if (!ticketRes.ok || !filesRes.ok) throw new Error('Failed to fetch ticket data');

                const ticketData = await ticketRes.json();
                const filesData = await filesRes.json();

                setOriginalTicket(ticketData.data);

                setFormField('department_target_id', ticketData.data.department_target_id);
                setFormField('description', ticketData.data.description);
                setFormField('physical_location_id', ticketData.data.physical_location_id?.Int64);
                setFormField('specified_location_name', ticketData.data.specified_location_name || '');
                if (ticketData.data.deadline?.Valid) {
                    setFormField('deadline', new Date(ticketData.data.deadline.Time));
                }
                const existingFiles: UploadedFile[] = [
                    ...(filesData.data.support_files || []),
                    ...(filesData.data.report_files || []),
                ].map((file: ApiFile) => ({
                    name: file.file_name,
                    size: file.file_size,
                    url: `${HTTP_BASE_URL}/files/view?path=${encodeURIComponent(file.file_path)}`,
                }));

                setOriginalFiles(existingFiles);
                setFormField('support_files', existingFiles);
            } catch {
                toast.error('Gagal memuat data tiket untuk revisi.');
            }
        };
        loadData();
        return () => reset();
    }, [id, fetchInitialData, setFormField, reset, accessToken, toast]);

    const handleRevise = async () => {
        if (!id || !originalTicket) return;
        setIsSubmitting(true);

        try {
            const currentFiles = formData.support_files;
            const currentUploadedFileUrls = currentFiles
                .filter((f): f is UploadedFile => 'url' in f)
                .map(f => f.url);

            const filePathsToDelete = originalFiles
                .filter(f => !currentUploadedFileUrls.includes(f.url))
                .map(f => {
                    const urlParams = new URLSearchParams(new URL(f.url, window.location.origin).search);
                    return urlParams.get('path') || '';
                }).filter(Boolean);

            const filesToAdd = currentFiles.filter((f): f is File => f instanceof File);

            const filePromises = [];

            if (filePathsToDelete.length > 0) {
                const deletePromise = fetch(`${HTTP_BASE_URL}/tickets/${id}/files`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({ file_paths_to_delete: filePathsToDelete }),
                });
                filePromises.push(deletePromise);
            }
            if (filesToAdd.length > 0) {
                const addBody = new FormData();
                filesToAdd.forEach(file => addBody.append('files', file));
                const addPromise = fetch(`${HTTP_BASE_URL}/tickets/${id}/files`, {
                    method: 'POST',
                    headers: { Authorization: `Bearer ${accessToken}` },
                    body: addBody,
                });
                filePromises.push(addPromise);
            }

            if (filePromises.length > 0) {
                const fileResponses = await Promise.all(filePromises);
                for (const res of fileResponses) {
                    if (!res.ok) throw new Error('Gagal memperbarui file lampiran.');
                }
            }

            const updatePayload = {
                department_target_id: formData.department_target_id,
                description: formData.description,
                physical_location_id: formData.physical_location_id,
                specified_location_name: formData.specified_location_name,
                deadline: formData.deadline ? format(formData.deadline, 'yyyy-MM-dd') : null,
                version: originalTicket.version,
            };

            if (updatePayload.specified_location_name && !updatePayload.physical_location_id) {
                toast.error('Lokasi Area wajib diisi jika Lokasi Sub Area diisi.');
                setIsSubmitting(false);
                return;
            }

            const updateRes = await apiClient(`${HTTP_BASE_URL}/tickets/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatePayload),
            });
            if (!updateRes.ok) throw new Error('Gagal memperbarui data tiket.');

            const resubmitBody = new FormData();
            resubmitBody.append('ActionName', 'Revisi');

            const resubmitRes = await apiClient(`${HTTP_BASE_URL}/tickets/${id}/action`, {
                method: 'POST',
                body: resubmitBody,
            });
            if (!resubmitRes.ok) throw new Error('Gagal mengirim ulang tiket untuk approval.');

            toast.success('Tiket berhasil direvisi dan dikirim ulang.');
            navigate(`/ticket/${id}`);

        } catch (error: any) {
            toast.error(error.message || 'Terjadi kesalahan saat merevisi tiket.');
        } finally {
            setIsSubmitting(false);
        }
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
                {id && <RejectionInfoCard ticketId={parseInt(id, 10)} />}

                {status === 'loading' && <Text className="text-center">Memuat data form...</Text>}
                {status === 'error' && <Text color="add-red" className="text-center">Gagal memuat data.</Text>}

                {status !== 'loading' && <CreateTicketForm />}

                <div className="flex justify-end gap-4 border-t pt-4">
                    <Button variant="secondary" onClick={() => navigate(-1)} disabled={isSubmitting}>
                        Batal
                    </Button>
                    <Button variant="primary-blue" onClick={handleRevise} isLoading={isSubmitting}>
                        Revisi
                    </Button>
                </div>
            </div>
        </Panel>
    );
}