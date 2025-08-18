import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { twMerge } from 'tailwind-merge';
import { Info, CheckCircle2, AlertTriangle, XCircle, X } from 'lucide-react';
import { Text } from './Text';


const messageBarVariants = cva(
    'flex w-full items-start gap-3 rounded-lg border p-4',
    {
        variants: {
            variant: {
                info: 'border-blue-mtm-300 bg-blue-mtm-200/20 text-blue-mtm-700',
                success: 'border-add-green/50 bg-add-green/10 text-add-green',
                warning: 'border-add-dark-yellow/50 bg-add-dark-yellow/10 text-add-dark-yellow',
                destructive: 'border-add-red/50 bg-add-red/10 text-add-red',
            },
        },
        defaultVariants: {
            variant: 'info',
        },
    }
);

const variantIcons = {
    info: <Info className="h-5 w-5" />,
    success: <CheckCircle2 className="h-5 w-5" />,
    warning: <AlertTriangle className="h-5 w-5" />,
    destructive: <XCircle className="h-5 w-5" />,
};

export interface MessageBarProps
    extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof messageBarVariants> {
    title?: string;
    children: ReactNode;
    onClose?: () => void;
}

const MessageBar = forwardRef<HTMLDivElement, MessageBarProps>(
    ({ className, variant, title, children, onClose, ...props }, ref) => {
        const Icon = variant ? variantIcons[variant] : variantIcons.info;

        return (
            <div
                ref={ref}
                role="alert"
                className={twMerge(messageBarVariants({ variant, className }))}
                {...props}
            >
                {/* ICON */}
                <div className="flex-shrink-0">{Icon}</div>

                {/* TEXT CONTENT */}
                <div className="flex-1">
                    {title && (
                        <Text as="h3" variant="body-md" weight="bold" className="mb-1">
                            {title}
                        </Text>
                    )}
                    <div className="text-sm">
                        {typeof children === 'string' ? (
                            <Text variant="body-sm">{children}</Text>
                        ) : (
                            children
                        )}
                    </div>
                </div>

                {/* CLOSE BUTTON IF NEEDED */}
                {onClose && (
                    <button
                        type="button"
                        onClick={onClose}
                        className="ml-auto flex-shrink-0 rounded-md p-1 opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-current"
                        aria-label="Close message"
                    >
                        <X className="h-5 w-5" strokeWidth={3.5} />
                    </button>
                )}
            </div>
        );
    }
);

MessageBar.displayName = 'MessageBar';

export { MessageBar };