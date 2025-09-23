import { Navigate } from 'react-router-dom';
import { useMasterEditGuard } from '../hooks/useMasterEditGuard';

export const MasterEditProtection = ({ children }: { children: React.ReactNode }) => {
    const { canAccessMasterEdit } = useMasterEditGuard();

    if (!canAccessMasterEdit) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};