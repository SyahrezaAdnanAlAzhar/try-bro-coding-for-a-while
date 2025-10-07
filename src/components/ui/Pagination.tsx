import { Button } from './Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className="flex items-center justify-center gap-2">
            <Button
                variant="secondary"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <ChevronLeft size={16} />
            </Button>
            <span className="text-sm font-medium">
                Page {currentPage} of {totalPages}
            </span>
            <Button
                variant="secondary"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                <ChevronRight size={16} />
            </Button>
        </div>
    );
};