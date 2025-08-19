import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStatus, useAuthUser, useAuthActions } from '../store/authStore';
import { Button } from '../components/Button';
import Logo from '../assets/Logo-MTM.svg';



export const Navbar = () => {
    const authStatus = useAuthStatus();
    const user = useAuthUser();
    const { logout } = useAuthActions();
    const navigate = useNavigate();

    const isLoggedIn = authStatus === 'authenticated' && user;

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const firstName = user?.employee_name.split(' ')[0] || '';

    const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
        `px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive
            ? 'text-blue-mtm-700'
            : 'text-mono-dark-grey hover:bg-blue-mtm-200/50'
        }`;

    return (
        <header className="bg-blue-mtm-100 shadow-md sticky top-0 z-50">
            <nav className="container mx-auto flex h-16 items-center justify-between px-4">
                {/* LOGO AND NAVIGATION */}
                <div className="flex items-center gap-4">
                    <Link
                        to="/"
                        className="flex items-center gap-2 rounded-full bg-mono-white px-4 py-2 text-blue-mtm-700 shadow-sm"
                    >
                        <img src={Logo} alt="Logo MTM" />
                        <span className="font-bold">Job Reservation</span>
                    </Link>
                    <div className="hidden md:flex items-baseline gap-2">
                        <NavLink to="/" className={navLinkClasses}>
                            Ticket
                        </NavLink>
                        {isLoggedIn && (
                            <NavLink to="/job" className={navLinkClasses}>
                                Job
                            </NavLink>
                        )}
                    </div>
                </div>

                {/* USER INFO AND AUTH */}
                <div className="flex items-center">
                    {isLoggedIn ? (
                        <div className="flex items-center gap-3">
                            <span className="hidden sm:block rounded-full bg-mono-white px-4 py-2 text-sm font-semibold text-mono-dark-grey">
                                {user.employee_npk} - {firstName}
                            </span>
                            <Button variant="secondary" size="sm" onClick={handleLogout}>
                                Log Out
                            </Button>
                        </div>
                    ) : (
                        <Button variant="primary-blue" size="sm" onClick={() => navigate('/login')}>
                            Login
                        </Button>
                    )}
                </div>
            </nav>
        </header>
    );
};