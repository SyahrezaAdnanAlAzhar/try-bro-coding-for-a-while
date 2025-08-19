import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStatus, useAuthUser, useAuthActions } from '../store/authStore';
import { Button } from '../components/Button';
import MtmLogo from '../assets/Logo-MTM.svg?react';
import { LogOut } from 'lucide-react';
import { twMerge } from 'tailwind-merge';
import "../App.css"

export const Navbar = () => {
    const authStatus = useAuthStatus();
    const user = useAuthUser();
    const { logout } = useAuthActions();
    const navigate = useNavigate();

    const isLoggedIn = authStatus === 'authenticated' && user;

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const firstName = user?.employee_name.split(' ')[0] || '';

    const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
        twMerge(
            'px-16 py-2 rounded-[240px] text-lg transition-all duration-200',
            isActive
                ? 'font-bold text-blue-mtm-500'
                : 'font-normal text-mono-black hover:font-bold hover:text-blue-mtm-500 hover:bg-mono-white'
        );

    return (
        <header className="bg-blue-mtm-100/30 shadow-s-500 sticky top-0 z-50">
            <nav className="container mx-auto flex h-16 items-center justify-between px-4">
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

                {/* Bagian Tengah (Navigasi) - Akan memanjang mengisi ruang */}
                <div className="items-baseline">
                    <NavLink to="/" className={navLinkClasses} end>
                        Ticket
                    </NavLink>
                </div>

                <div className="items-baseline">
                    {isLoggedIn && (
                        <NavLink to="/job" className={navLinkClasses}>
                            Job
                        </NavLink>
                    )}
                </div>

                {/* Bagian Kanan (Auth) - Tidak akan memanjang */}
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
                        <Button variant="primary-blue" size="sm" onClick={() => navigate('/login')}>
                            Masuk
                        </Button>
                    )}
                </div>
            </nav>
        </header>
    );
};