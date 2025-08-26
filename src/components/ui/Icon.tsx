import React, { useState, useEffect, type SVGProps } from 'react';

interface IconProps extends SVGProps<SVGSVGElement> {
    name: string;
    size?: number;
}

export const Icon = ({ name, size = 24, className, ...props }: IconProps) => {
    const [SvgIcon, setSvgIcon] = useState<React.FC<React.SVGProps<SVGSVGElement>> | null>(null);

    useEffect(() => {
        const importIcon = async () => {
            try {
                const importedIcon = await import(`../../assets/icons/${name}.svg?react`);
                setSvgIcon(() => importedIcon.default);
            } catch (error) {
                console.error(`Icon not found: ${name}`, error);
                setSvgIcon(null);
            }
        };

        importIcon();
    }, [name]);

    if (!SvgIcon) {
        return <div style={{ width: size, height: size }} />;
    }

    return (
        <SvgIcon
            width={size}
            height={size}
            className={className}
            {...props}
        />
    );
};