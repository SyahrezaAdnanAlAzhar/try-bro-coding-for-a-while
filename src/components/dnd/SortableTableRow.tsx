import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface SortableTableRowProps {
    id: string | number;
    children: React.ReactNode;
}

export const SortableTableRow = ({ id, children }: SortableTableRowProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 10 : 0,
    };

    return (
        <tr ref={setNodeRef} style={style} {...attributes}>
            <td className="px-2 py-3 align-middle">
                <button
                    {...listeners}
                    className="cursor-grab touch-none p-2 text-mono-grey hover:text-mono-black active:cursor-grabbing"
                >
                    <GripVertical size={18} />
                </button>
            </td>
            {children}
        </tr>
    );
};