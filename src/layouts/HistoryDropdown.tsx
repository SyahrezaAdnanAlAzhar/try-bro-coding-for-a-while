import { Link, NavLink } from 'react-router-dom';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/Popover';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
import { useAuthorization } from '../hooks/useAuthorization';

interface HistoryDropdownProps {
    navLinkClasses: (props: { isActive: boolean }) => string;
}

export const HistoryDropdown = ({ navLinkClasses }: HistoryDropdownProps) => {
    const [open, setOpen] = useState(false);
    const { can } = useAuthorization();

    if (!can('CREATE_TICKET')) {
        return (
            <NavLink to="/history/all" className={navLinkClasses}>
                Riwayat
            </NavLink>
        );
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger className={navLinkClasses({ isActive: false })}>
                <span className="flex items-center gap-1">
                    Riwayat
                    <ChevronDown size={20} strokeWidth={2.4} />
                </span>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-2">
                <nav className="flex flex-col gap-1">
                    <Link
                        to="/history/all"
                        className="block rounded-md px-3 py-2 text-sm font-medium text-mono-dark-grey hover:bg-blue-mtm-400 hover:text-mono-white hover:font-bold hover:tracking-wider"
                        onClick={() => setOpen(false)}
                    >
                        Seluruh Ticket
                    </Link>
                    <Link
                        to="/history/my"
                        className="block rounded-md px-3 py-2 text-sm font-medium text-mono-dark-grey hover:bg-blue-mtm-400 hover:text-mono-white hover:font-bold hover:tracking-wider"
                        onClick={() => setOpen(false)}
                    >
                        Ticket Saya
                    </Link>
                </nav>
            </PopoverContent>
        </Popover>
    );
};