export const formatBytes = (bytes: number, decimals = 2): string => {
    if (!+bytes) return '0 Bytes';

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

export const getIconForFileType = (fileType: string): string => {
    const type = fileType.toLowerCase();

    if (type.startsWith('image')) {
        return 'icon-image';
    }
    if (type === 'pdf') {
        return 'icon-pdf';
    }
    if (type === 'document' || type.includes('word') || type.includes('sheet')) {
        return 'icon-document';
    }
    if (type === 'video') {
        return 'icon-video';
    }
    if (type === 'archive' || type === 'zip' || type === 'rar') {
        return 'icon-archive';
    }

    return 'icon-unknown';
};