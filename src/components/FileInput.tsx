import { useCallback, useState, useEffect } from 'react';
import { useDropzone, type Accept } from 'react-dropzone';
import { UploadCloud, File as FileIcon, Trash2, Eye } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import { Button } from './Button';

export interface UploadedFile {
    name: string;
    size: number;
    url: string;
}

type FileState = File | UploadedFile;

const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

const isUploadedFile = (file: FileState): file is UploadedFile => 'url' in file;

export interface FileInputProps {
    label: string;
    onFilesChange: (files: FileState[]) => void;
    initialFiles?: UploadedFile[];
    accept?: Accept;
    multiple?: boolean;
    maxSize?: number;
    disabled?: boolean;
    error?: string;
    helpText?: string;
}

export const FileInput = ({
    label,
    onFilesChange,
    initialFiles = [],
    accept,
    multiple = true,
    maxSize,
    disabled,
    error,
    helpText,
}: FileInputProps) => {
    const [files, setFiles] = useState<FileState[]>(initialFiles);

    const [previewUrls, setPreviewUrls] = useState<Record<string, string>>({});

    useEffect(() => {
        setFiles(initialFiles);
    }, [initialFiles]);

    useEffect(() => {
        const newUrls: Record<string, string> = {};
        files.forEach(file => {
            if (file instanceof File) {
                newUrls[file.name] = URL.createObjectURL(file);
            }
        });
        setPreviewUrls(newUrls);

        return () => {
            Object.values(newUrls).forEach(url => URL.revokeObjectURL(url));
        };
    }, [files]);

    const onDrop = useCallback(
        (acceptedFiles: File[]) => {
            if (acceptedFiles?.length) {
                const newFiles = multiple ? [...files, ...acceptedFiles] : [...acceptedFiles];
                setFiles(newFiles);
                onFilesChange(newFiles);
            }
        },
        [files, multiple, onFilesChange]
    );

    const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
        onDrop,
        accept,
        maxSize,
        multiple,
        disabled,
    });

    const removeFile = (indexToRemove: number) => {
        const newFiles = files.filter((_, index) => index !== indexToRemove);
        setFiles(newFiles);
        onFilesChange(newFiles);
    };

    const baseDropzoneClasses =
        'flex flex-col items-center justify-center w-full p-8 text-center border-2 border-dashed rounded-lg cursor-pointer transition-colors';
    const dropzoneStateClasses = isDragActive
        ? 'border-blue-mtm-400 bg-blue-mtm-100/50'
        : isDragReject || !!error
            ? 'border-add-red bg-add-red/10'
            : 'border-mono-grey hover:border-blue-mtm-400 hover:bg-blue-mtm-100/20';

    return (
        <div className="w-full">
            <label className="text-base font-semibold text-mono-black">{label}</label>
            <div
                {...getRootProps({
                    className: twMerge(baseDropzoneClasses, dropzoneStateClasses),
                })}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadCloud
                        className={twMerge(
                            'h-10 w-10 mb-4',
                            isDragReject || !!error ? 'text-add-red' : 'text-blue-mtm-400'
                        )}
                    />
                    <p className="mb-2 text-sm text-mono-dark-grey">
                        <span className="font-semibold">Klik untuk upload</span> atau seret dan lepas
                    </p>
                    {helpText && <p className="text-xs text-mono-grey">{helpText}</p>}
                </div>
            </div>

            {/* FILE LIST */}
            {files.length > 0 && (
                <div className="mt-4 space-y-2">
                    {files.map((file, index) => {
                        const fileUrl = isUploadedFile(file) ? file.url : previewUrls[file.name];

                        return (
                            <div
                                key={index}
                                className="flex items-center justify-between rounded-lg border border-mono-light-grey bg-mono-white p-3"
                            >
                                <div className="flex items-center gap-3">
                                    <FileIcon className="h-6 w-6 text-blue-mtm-400" />
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-mono-black">{file.name}</span>
                                        <span className="text-xs text-mono-dark-grey">{formatBytes(file.size)}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {fileUrl && (
                                        <a href={fileUrl} target="_blank" rel="noopener noreferrer">
                                            <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0">
                                                <Eye className="h-5 w-5" />
                                            </Button>
                                        </a>
                                    )}
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeFile(index)}
                                        className="h-8 w-8 p-0 text-add-red hover:bg-add-red/20"
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* ERROR MESSAGE */}
            <div className="mt-1 h-6">
                {error && <p className="text-base font-normal text-add-red">{error}</p>}
            </div>
        </div>
    );
};