import { useAuthUser } from "../store/authStore";
import { useIsEditModeActive } from "../store/realtimeStore";

export const useMasterEditGuard = () => {
    const user = useAuthUser();
    const isEditModeActive = useIsEditModeActive();

    const isMasterUser = user?.user_type === 'master';
    const canAccessMasterEdit = isMasterUser && isEditModeActive;

    return { canAccessMasterEdit };
};