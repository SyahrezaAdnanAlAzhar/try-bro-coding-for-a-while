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

interface MasterEditDropdownProps {
    navLinkClasses: (props: { isActive: boolean }) => string;
}

export const MasterEditDropdown = ({ navLinkClasses }: MasterEditDropdownProps) => {
    const [open, setOpen] = useState(false);
    const { canAccessMasterEdit } = useMasterEditGuard();

    if (!canAccessMasterEdit) {
        return null;
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger className={navLinkClasses({ isActive: false })}>
                <span className="flex items-center gap-1">
                    Edit Data
                    <ChevronDown size={20} strokeWidth={2.4} />
                </span>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2">
                <nav className="flex flex-col gap-1">
                    {MASTER_LINKS.map(link => (
                        <Link
                            key={link.to}
                            to={link.to}
                            className="block rounded-md px-3 py-2 text-sm font-medium text-mono-dark-grey hover:bg-blue-mtm-400 hover:text-mono-white hover:font-bold hover:tracking-wider"
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