import { twMerge } from "tailwind-merge";
import { useDepartmentSelectors } from "../../../store/departmentStore";
import { Badge } from "../../ui/Badge";
import { Text } from "../../ui/Text";

interface DepartmentBadgeProps {
    departmentName: string;
}

export const DepartmentBadge = ({ departmentName }: DepartmentBadgeProps) => {
    const { getBadgeColorClass } = useDepartmentSelectors();
    const bgColorClass = getBadgeColorClass(departmentName);

    return (
        <Badge
            className={twMerge(
                'w-full border-transparent',
                bgColorClass
            )}
        >
            <Text variant="body-sm" weight="bold" className="text-mono-white">
                {departmentName}
            </Text>
        </Badge>
    );
};