import type { FilterOption, FilterOptions, SelectedFilters } from "../../../types/filter";
import { Badge } from "../../ui/Badge";
import { Button } from "../../ui/Button";
import { Combobox } from "../../ui/Combobox";
import { Text } from '../../ui/Text';
import { Modal, ModalContent, ModalFooter, ModalHeader, ModalTitle } from "../../ui/Modal";
import { X } from "lucide-react";

interface FilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    options: FilterOptions;
    selectedFilters: SelectedFilters;
    onFilterChange: <K extends keyof SelectedFilters>(filterType: K, value: SelectedFilters[K]) => void;
    onApply: () => void;
    onReset: () => void;
}

const FilterSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div className="space-y-2 border-b pb-4">
        <Text weight="bold">{title}</Text>
        {children}
    </div>
);

export const FilterModal = ({
    isOpen,
    onClose,
    options,
    selectedFilters,
    onFilterChange,
    onApply,
    onReset,
}: FilterModalProps) => {

    const handleMultiSelectChange = (
        type: 'requestorDepartmentIds' | 'requestorNpks' | 'picNpks',
        option: FilterOption | null
    ) => {
        if (!option) return;
        const currentSelection = selectedFilters[type] as (string | number)[];
        if (!currentSelection.includes(option.value)) {
            onFilterChange(type, [...currentSelection, option.value] as any);
        }
    };

    const handleRemoveSelectedItem = (
        type: 'requestorDepartmentIds' | 'requestorNpks' | 'picNpks',
        valueToRemove: string | number
    ) => {
        const currentSelection = selectedFilters[type] as (string | number)[];
        onFilterChange(type, currentSelection.filter(v => v !== valueToRemove) as any);
    };

    const getSelectedItems = (
        type: 'requestorDepartmentIds' | 'requestorNpks' | 'picNpks',
        sourceOptions: FilterOption[]
    ) => {
        const selectedValues = selectedFilters[type];

        if (type === 'requestorDepartmentIds') {
            const selectedSet = new Set(selectedValues as number[]);
            return sourceOptions.filter(opt => selectedSet.has(opt.value as number));
        } else {
            const selectedSet = new Set(selectedValues as string[]);
            return sourceOptions.filter(opt => selectedSet.has(opt.value as string));
        }
    };

    return (
        <Modal open={isOpen} onOpenChange={onClose}>
            <ModalContent className="max-w-2xl">
                <ModalHeader>
                    <ModalTitle>Filter Tiket</ModalTitle>
                </ModalHeader>
                <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
                    {/* Status Filter */}
                    <FilterSection title="Status">
                        <div className="grid grid-cols-2 gap-2">
                            {options.statuses.map(status => (
                                <label key={status.id} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={selectedFilters.statusIds.includes(status.id)}
                                        onChange={(e) => {
                                            const newSelection = e.target.checked
                                                ? [...selectedFilters.statusIds, status.id]
                                                : selectedFilters.statusIds.filter(id => id !== status.id);
                                            onFilterChange('statusIds', newSelection);
                                        }}
                                    />
                                    <Badge style={{ backgroundColor: status.hex_color, borderColor: 'transparent' }}>
                                        <Text variant="body-sm" weight="bold" className="text-mono-white">{status.name}</Text>
                                    </Badge>
                                </label>
                            ))}
                        </div>
                    </FilterSection>

                    {/* Requestor Department Filter */}
                    <FilterSection title="Departemen Requestor">
                        <Combobox options={options.requestorDepartments} value={null} onChange={(opt) => handleMultiSelectChange('requestorDepartmentIds', opt)} placeholder="Cari departemen..." />
                        <div className="flex flex-wrap gap-2 pt-2">
                            {getSelectedItems('requestorDepartmentIds', options.requestorDepartments).map(item => (
                                <Badge key={item.value} className="bg-blue-mtm-100 border-blue-mtm-200">
                                    <Text variant="body-sm">{item.label}</Text>
                                    <button onClick={() => handleRemoveSelectedItem('requestorDepartmentIds', item.value)} className="ml-2"><X size={14} /></button>
                                </Badge>
                            ))}
                        </div>
                    </FilterSection>

                    {/* Requestor Filter */}
                    <FilterSection title="Requestor">
                        <Combobox options={options.requestors} value={null} onChange={(opt) => handleMultiSelectChange('requestorNpks', opt)} placeholder="Cari requestor (NPK/Nama)..." />
                        <div className="flex flex-wrap gap-2 pt-2">
                            {getSelectedItems('requestorNpks', options.requestors).map(item => (
                                <Badge key={item.value} className="bg-blue-mtm-100 border-blue-mtm-200">
                                    <Text variant="body-sm">{item.label}</Text>
                                    <button onClick={() => handleRemoveSelectedItem('requestorNpks', item.value)} className="ml-2"><X size={14} /></button>
                                </Badge>
                            ))}
                        </div>
                    </FilterSection>

                    {/* PIC Filter */}
                    <FilterSection title="PIC">
                        <Combobox options={options.pics} value={null} onChange={(opt) => handleMultiSelectChange('picNpks', opt)} placeholder="Cari PIC (NPK/Nama)..." />
                        <div className="flex flex-wrap gap-2 pt-2">
                            {getSelectedItems('picNpks', options.pics).map(item => (
                                <Badge key={item.value} className="bg-blue-mtm-100 border-blue-mtm-200">
                                    <Text variant="body-sm">{item.label}</Text>
                                    <button onClick={() => handleRemoveSelectedItem('picNpks', item.value)} className="ml-2"><X size={14} /></button>
                                </Badge>
                            ))}
                        </div>
                    </FilterSection>
                </div>
                <ModalFooter>
                    <Button variant="secondary" onClick={onReset}>Reset</Button>
                    <Button variant="primary-blue" onClick={onApply}>Terapkan</Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};