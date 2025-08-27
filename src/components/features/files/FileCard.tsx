import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { formatBytes, getIconForFileType } from '../../../utils/fileUtils';
import { Icon } from '../../ui/Icon';
import { Button } from '../../ui/Button';
import { Text } from '../../ui/Text';

interface FileCardProps {
    fileName: string;
    fileType: string;
    fileSize: number;
    uploadedAt: string;
    onView: () => void;
    onDownload: () => void;
}

export const FileCard = ({
    fileName,
    fileType,
    fileSize,
    uploadedAt,
    onView,
    onDownload,
}: FileCardProps) => {
    const iconName = getIconForFileType(fileType);
    const formattedDate = format(new Date(uploadedAt), 'd MMMM yyyy', { locale: id });

    return (
        <div className="flex items-center gap-4 rounded-lg bg-mono-light-grey/50 p-3">
            <Icon name={iconName} size={40} className="flex-shrink-0 text-mono-dark-grey" />

            <div className="flex-grow overflow-hidden">
                <Text weight="bold" className="truncate">
                    {fileName}
                </Text>
                <Text variant="body-sm" color="mono-dark-grey">
                    Terakhir diubah pada tanggal: {formattedDate}
                </Text>
                <Text variant="body-sm" color="mono-grey">
                    {formatBytes(fileSize)}
                </Text>
            </div>

            <div className="flex flex-shrink-0 items-center gap-2">
                <Button variant="ghost" size="sm" className="h-10 w-10 p-0" onClick={onView}>
                    <Icon name="view_detail" size={24} />
                </Button>
                <Button variant="ghost" size="sm" className="h-10 w-10 p-0" onClick={onDownload}>
                    <Icon name="download" size={24} />
                </Button>
            </div>
        </div>
    );
};