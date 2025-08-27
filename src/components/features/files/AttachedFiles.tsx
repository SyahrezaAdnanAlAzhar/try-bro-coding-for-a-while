import { useState, useEffect } from 'react';
import { useAuthStore } from '../../../store/authStore';
import { useToast } from '../../../hooks/useToast';
import { Text } from '../../ui/Text';
import { FileCard } from './FileCard';

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

interface AttachedFilesProps {
    ticketId: number;
}

const API_BASE_URL = '/api/e-memo-job-reservation';

export const AttachedFiles = ({ ticketId }: AttachedFilesProps) => {
    const [files, setFiles] = useState<AttachedFilesData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const accessToken = useAuthStore((state) => state.accessToken);
    const toast = useToast();

    useEffect(() => {
        const fetchFiles = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${API_BASE_URL}/tickets/${ticketId}/files`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                if (!response.ok) throw new Error('Failed to fetch attached files');
                const { data } = await response.json();
                setFiles(data);
            } catch (error) {
                console.error(error);
                toast.error('Gagal memuat daftar file.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchFiles();
    }, [ticketId, accessToken, toast]);

    const handleFileAction = async (filePath: string, action: 'view' | 'download', fileName: string) => {
        try {
            const encodedPath = encodeURIComponent(filePath);
            const response = await fetch(`${API_BASE_URL}/files/${action}?path=${encodedPath}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            if (!response.ok) throw new Error(`Failed to ${action} file.`);

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
            window.URL.revokeObjectURL(url);
        } catch (error: any) {
            toast.error(error.message);
        }
    };

    if (isLoading) {
        return (
            <div className="space-y-2">
                <div className="h-16 w-full rounded-lg bg-gray-200 animate-pulse" />
                <div className="h-16 w-full rounded-lg bg-gray-200 animate-pulse" />
            </div>
        );
    }

    if (!files || (files.support_files.length === 0 && files.report_files.length === 0)) {
        return <Text color="mono-grey">Tidak ada file terlampir.</Text>;
    }

    return (
        <div className="space-y-6">
            {files.support_files.length > 0 && (
                <div className="space-y-3">
                    <Text weight="bold">File Pendukung</Text>
                    {files.support_files.map((file) => (
                        <FileCard
                            key={file.file_path}
                            fileName={file.file_name}
                            fileType={file.file_type}
                            fileSize={file.file_size}
                            uploadedAt={file.uploaded_at}
                            onView={() => handleFileAction(file.file_path, 'view', file.file_name)}
                            onDownload={() => handleFileAction(file.file_path, 'download', file.file_name)}
                        />
                    ))}
                </div>
            )}
            {files.report_files.length > 0 && (
                <div className="space-y-3">
                    <Text weight="bold">File Laporan</Text>
                    {files.report_files.map((file) => (
                        <FileCard
                            key={file.file_path}
                            fileName={file.file_name}
                            fileType={file.file_type}
                            fileSize={file.file_size}
                            uploadedAt={file.uploaded_at}
                            onView={() => handleFileAction(file.file_path, 'view', file.file_name)}
                            onDownload={() => handleFileAction(file.file_path, 'download', file.file_name)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};