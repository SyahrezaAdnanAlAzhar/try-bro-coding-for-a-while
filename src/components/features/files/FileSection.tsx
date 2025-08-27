import { Text } from '../../ui/Text';
import { FileCard } from './FileCard';

interface FileData {
    file_name: string;
    file_path: string;
    file_size: number;
    file_type: string;
    uploaded_at: string;
}

interface FileSectionProps {
    title: string;
    files: FileData[];
    onFileAction: (filePath: string, action: 'view' | 'download', fileName: string) => void;
}

export const FileSection = ({ title, files, onFileAction }: FileSectionProps) => {
    if (files.length === 0) {
        return null;
    }

    return (
        <div className="space-y-3 mb-5">
            <Text weight="bold" className="text-blue-mtm-400">{title}</Text>
            {files.map((file) => (
                <FileCard
                    key={file.file_path}
                    fileName={file.file_name}
                    fileType={file.file_type}
                    fileSize={file.file_size}
                    uploadedAt={file.uploaded_at}
                    onView={() => onFileAction(file.file_path, 'view', file.file_name)}
                    onDownload={() => onFileAction(file.file_path, 'download', file.file_name)}
                />
            ))}
        </div>
    );
};