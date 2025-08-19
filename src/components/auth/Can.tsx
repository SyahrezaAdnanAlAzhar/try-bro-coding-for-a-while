import { useAuthorization, type Permission } from '../../hooks/useAuthorization';

interface CanProps {
    permission: Permission;
    children: React.ReactNode;
}

export const Can = ({ permission, children }: CanProps) => {
    const { can } = useAuthorization();

    if (!can(permission)) {
        return null;
    }

    return <>{children}</>;
};