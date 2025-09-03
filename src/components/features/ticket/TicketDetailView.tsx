import { useEffect, useState } from 'react';
import { useToast } from '../../../hooks/useToast';
import { useAuthStatus, useAuthStore } from '../../../store/authStore';
import { type Ticket } from '../../../types/api';
import { FormField } from '../../ui/FormField';
import { Text } from '../../ui/Text';
import { DeadlineCell } from './table/DeadlineCell';
import { FileSection } from '../files/FileSection';
import { TicketActionHandler } from '../actions/TicketActionHandler';

interface FileData {
    file_name: string;
    file_path: string;
    file_size: number;
    file_type: string;
    uploaded_at: string;
}

interface AttachedFilesData {
    support_files: FileData[];
    report_files: FileData[];
}

interface TicketDetailViewProps {
    ticket: Ticket;
    onActionSuccess: () => void;
}

const API_BASE_URL = '/api/e-memo-job-reservation';

export const TicketDetailView = ({ ticket, onActionSuccess }: TicketDetailViewProps) => {
    const authStatus = useAuthStatus();
    const isLoggedIn = authStatus === 'authenticated';
    const accessToken = useAuthStore((state) => state.accessToken);
    const toast = useToast();

    const [attachedFiles, setAttachedFiles] = useState<AttachedFilesData | null>(null);
    const [isLoadingFiles, setIsLoadingFiles] = useState(true);

    useEffect(() => {
        if (!isLoggedIn) return;

        const fetchFiles = async () => {
            setIsLoadingFiles(true);
            try {
                const response = await fetch(`${API_BASE_URL}/tickets/${ticket.ticket_id}/files`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                if (!response.ok) throw new Error('Failed to fetch attached files');
                const { data } = await response.json();
                setAttachedFiles(data);
            } catch (error) {
                console.error(error);
                toast.error('Gagal memuat daftar file.');
            } finally {
                setIsLoadingFiles(false);
            }
        };
        fetchFiles();
    }, [isLoggedIn, ticket.ticket_id, accessToken, toast]);


    const handleFileAction = async (filePath: string, action: 'view' | 'download', fileName: string) => {
        if (!accessToken) {
            toast.error('Anda harus login untuk mengakses file.');
            return;
        }
        try {
            const encodedPath = encodeURIComponent(filePath);
            const response = await fetch(`${API_BASE_URL}/files/${action}?path=${encodedPath}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (!response.ok) throw new Error(`Gagal untuk ${action} file.`);

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            if (action === 'view') {
                window.open(url, '_blank');
            } else {
                const a = document.createElement('a');
                a.href = url;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                a.remove();
            }
            setTimeout(() => window.URL.revokeObjectURL(url), 100);
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    return (
        <div className="grid grid-cols-1 gap-x-12 md:grid-cols-2">
            <FormField
                label="Department"
                value={ticket.department_target_name}
                readOnly
            />

            <FormField
                label="Requestor"
                value={`${ticket.requestor_npk} - ${ticket.requestor_name} - ${ticket.requestor_department}`}
                readOnly
            />

            <div className="md:col-span-2">
                <FormField
                    as="textarea"
                    label="Job Description"
                    value={ticket.description}
                    readOnly
                    rows={5}
                />
            </div>

            {isLoggedIn && (
                <>
                    {isLoadingFiles ? (
                        <div className="md:col-span-2 space-y-2">
                            <div className="h-16 w-full rounded-lg bg-gray-200 animate-pulse" />
                        </div>
                    ) : (
                        <div className="md:col-span-2">
                            <FileSection title="File Pendukung" files={attachedFiles?.support_files || []} onFileAction={handleFileAction} />
                        </div>
                    )}
                </>
            )}

            <div className="md:col-span-2">
                <FormField
                    label="PIC Job"
                    value={ticket.pic_name ? `${ticket.pic_npk} - ${ticket.pic_name}` : '-'}
                    readOnly
                />
            </div>

            <FormField
                label="Lokasi Area"
                value={ticket.location_name || '-'}
                readOnly
            />

            <FormField
                label="Lokasi Daerah"
                value={ticket.specified_location_name || '-'}
                readOnly
            />

            <div className="md:col-span-2 rounded-lg border bg-mono-white p-4 space-y-3 mb-5">
                <label className="mb-2 block text-base font-semibold text-blue-mtm-400">
                    Rangkuman Waktu
                </label>
                <div className="flex items-baseline gap-2">
                    <Text variant="body-sm" color="mono-dark-grey">Usia Tiket :</Text>
                    <Text weight="bold">{ticket.ticket_age_days} Hari</Text>
                </div>
                <div className="flex items-start gap-2">
                    <Text variant="body-sm" color="mono-dark-grey">Deadline :</Text>
                    <DeadlineCell deadline={ticket.deadline} daysRemaining={ticket.days_remaining} className="text-left" />
                </div>
            </div>

            {isLoggedIn && (
                <>
                    {isLoadingFiles ? (
                        <div className="md:col-span-2 space-y-2">
                            <div className="h-16 w-full rounded-lg bg-gray-200 animate-pulse" />
                        </div>
                    ) : (
                        <div className="md:col-span-2">
                            <FileSection title="File Laporan" files={attachedFiles?.report_files || []} onFileAction={handleFileAction} />
                        </div>
                    )}
                </>
            )}
            {isLoggedIn && (
                <>
                    <div className="md:col-span-2 mt-4 pt-6 border-t flex justify-center">
                        <div className="w-full md:w-1/2">
                            <TicketActionHandler
                                ticketId={ticket.ticket_id}
                                ticketDescription={ticket.description}
                                onSuccess={onActionSuccess}
                                buttonSize="lg"
                                fullWidth={true}
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};