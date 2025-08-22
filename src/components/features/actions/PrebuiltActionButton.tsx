
import { useActionSelectors } from '../../../store/actionStore';
import { Button, type ButtonProps } from '../../ui/Button';

type PrebuiltButtonProps = Omit<ButtonProps, 'customColor' | 'variant'>;

interface PrebuiltActionButtonProps extends PrebuiltButtonProps {
    actionName: string;
}

export const PrebuiltActionButton = ({ actionName, ...buttonProps }: PrebuiltActionButtonProps) => {
    const { getActionByName } = useActionSelectors();
    const action = getActionByName(actionName);

    if (!action) {
        return (
            <Button disabled {...buttonProps}>
                {actionName}
            </Button>
        );
    }

    return (
        <Button customColor={action.hex_code} {...buttonProps}>
            {action.name}
        </Button>
    );
};