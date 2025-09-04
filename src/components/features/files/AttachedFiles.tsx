import { useState, useEffect } from 'react';
import { useAuthStore } from '../../../store/authStore';
import { useToast } from '../../../hooks/useToast';
import { HTTP_BASE_URL } from '../../../config/api';

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
    onDataLoaded: (data: AttachedFilesData) => void;
}

export const AttachedFiles = ({ ticketId, onDataLoaded }: AttachedFilesProps) => {
    const [isLoading, setIsLoading] = useState(true);
    const accessToken = useAuthStore((state) => state.accessToken);
    const toast = useToast();

    useEffect(() => {
        const fetchFiles = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${HTTP_BASE_URL}/tickets/${ticketId}/files`, {
                    headers: { Authorization: `Bearer ${accessToken}` },
                });
                if (!response.ok) throw new Error('Failed to fetch attached files');
                const { data } = await response.json();
                onDataLoaded(data);
            } catch (error) {
                console.error(error);
                toast.error('Gagal memuat daftar file.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchFiles();
    }, [ticketId, accessToken, toast, onDataLoaded]);

    if (isLoading) {
        return (
            <div className="space-y-2">
                <div className="h-16 w-full rounded-lg bg-gray-200 animate-pulse" />
            </div>
        );
    }

    return null;
};