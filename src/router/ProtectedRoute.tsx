import { Navigate } from 'react-router-dom';
import { useAuthStatus } from '../store/authStore';
import { FullScreenLoader } from '../components/FullScreenLoader';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    const authStatus = useAuthStatus();

    if (authStatus === 'idle' || authStatus === 'loading') {
        return <FullScreenLoader />;
    }

    if (authStatus === 'unauthenticated') {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};