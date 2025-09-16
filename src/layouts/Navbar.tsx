import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStatus, useAuthUser, useAuthActions } from '../store/authStore';
import { useDepartments, useDepartmentSelectors, useSelectedDepartmentId } from '../store/departmentStore';
import { Button } from '../components/ui/Button';
import MtmLogo from '../assets/Logo-MTM.svg?react';
import { LogOut } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import "../App.css"
import { useMemo } from 'react';
import { useAuthorization } from '../hooks/useAuthorization';
import { HistoryDropdown } from './HistoryDropdown';

export const Navbar = () => {
    const authStatus = useAuthStatus();
    const user = useAuthUser();
    const { logout } = useAuthActions();
    const navigate = useNavigate();
    const location = useLocation();
    const { can } = useAuthorization();

    const departments = useDepartments();
    const selectedDepartmentId = useSelectedDepartmentId();
    const { getNavbarColorClass } = useDepartmentSelectors();

    const isLoggedIn = authStatus === 'authenticated' && user;
    const firstName = user?.employee_name.split(' ')[0] || '';

    const navbarColorClass = useMemo(() => {
        if (location.pathname.startsWith('/job') && user) {
            return getNavbarColorClass(user.employee_department);
        }
        if ((location.pathname === '/' || location.pathname.startsWith('/history')) && selectedDepartmentId) {
            const selectedDept = departments.find(d => d.id === selectedDepartmentId);
            return getNavbarColorClass(selectedDept?.name);
        }
        return 'bg-blue-mtm-100';
    }, [location.pathname, user, selectedDepartmentId, departments, getNavbarColorClass]);

    const canViewJobLink = useMemo(() => {
        if (!isLoggedIn || !user?.employee_department || departments.length === 0) {
            return false;
        }
        return departments.some(
            (dep) => dep.name.toUpperCase() === user.employee_department.toUpperCase()
        );
    }, [isLoggedIn, user?.employee_department, departments]);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
        twMerge(
            'px-16 py-2 rounded-[240px] text-lg transition-all duration-200',
            isActive
                ? 'font-bold text-blue-mtm-500'
                : 'font-normal text-mono-black hover:font-bold hover:text-blue-mtm-500 hover:bg-mono-white'
        );

    return (
        <header className={twMerge("sticky top-0 z-50 transition-colors duration-300", navbarColorClass)}>
            <div>
                <nav className={twMerge("container mx-auto flex h-16 items-center justify-between rounded-t-2xl px-4")}>
                    {/* LOGO AND NAVIGATION */}
                    <div className="flex-shrink-0">
                        <Link
                            to="/"
                            className="flex items-center gap-2 rounded-full bg-mono-white px-3 py-2 text-blue-mtm-700 shadow-sm"
                        >
                            <MtmLogo className="h-6 w-auto" />
                            <span className="font-bold">Job Reservation</span>
                        </Link>
                    </div>

                    {/* MAIN NAV */}
                    <div className="items-baseline">
                        <NavLink to="/" className={navLinkClasses} end>
                            Ticket
                        </NavLink>
                        {isLoggedIn && can('CREATE_TICKET') && (
                            <NavLink to="/approval" className={navLinkClasses}>
                                Approval
                            </NavLink>
                        )}
                        {canViewJobLink && (
                            <NavLink to="/job" className={navLinkClasses}>
                                Job
                            </NavLink>
                        )}
                        {isLoggedIn &&
                            <HistoryDropdown navLinkClasses={navLinkClasses} />
                        }
                    </div>

                    {/* AUTH */}
                    <div className="flex-shrink-0">
                        {isLoggedIn ? (
                            <div className="flex items-center gap-3">
                                <div className="hidden sm:block rounded-full bg-mono-white px-4 py-2 text-sm font-semibold text-mono-dark-grey">
                                    <span>{user.employee_npk} - </span>
                                    <span className="text-blue-mtm-500">{firstName}</span>
                                </div>
                                <Button variant="destructive" size="sm" onClick={handleLogout} leftIcon={<LogOut size={16} strokeWidth={4} />}>
                                    Keluar
                                </Button>
                            </div>
                        ) : (
                            <Button variant="blue-mtm-dark" size="sm" onClick={() => navigate('/login')}>
                                Masuk
                            </Button>
                        )}
                    </div>
                </nav>
            </div>
        </header>
    );
};