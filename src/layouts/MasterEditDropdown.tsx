import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMasterEditGuard } from '../hooks/useMasterEditGuard';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/Popover';
import { ChevronDown } from 'lucide-react';

const MASTER_LINKS = [
    { to: '/master/department', label: 'Department' },
    { to: '/master/area', label: 'Area' },
    { to: '/master/employee', label: 'Employee' },
    { to: '/master/authorization', label: 'Authorization' },
    { to: '/master/ticket', label: 'Ticket' },
];

export const MasterEditDropdown = () => {
    const [open, setOpen] = useState(false);
    const { canAccessMasterEdit } = useMasterEditGuard();

    if (!canAccessMasterEdit) {
        return null;
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger className="flex items-center gap-1 px-3 py-2 rounded-md text-base font-medium text-mono-dark-grey hover:bg-blue-mtm-200/50">
                <span>Edit Data</span>
                <ChevronDown size={16} />
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2">
                <nav className="flex flex-col gap-1">
                    {MASTER_LINKS.map(link => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className="block rounded-md px-3 py-2 text-sm font-medium text-mono-dark-grey hover:bg-blue-mtm-100/50"
                            onClick={() => setOpen(false)}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>
            </PopoverContent>
        </Popover>
    );
};