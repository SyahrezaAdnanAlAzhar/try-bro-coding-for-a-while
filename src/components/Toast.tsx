import { X, Info, CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react";
import { ToastContainer, toast, type ToastOptions, Slide, type ToastIcon, type ToastClassName } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { twMerge } from "tailwind-merge";
import React from "react";

type ToastVariant = "info" | "success" | "warning" | "error";

const variantConfig: Record<
    ToastVariant,
    { icon: ToastIcon; className: string }
> = {
    info: {
        icon: <Info className="w-5 h-5 text-blue-mtm-500" />,
        className:
            "border-l-4 border-blue-mtm-500 bg-mono-white text-mono-dark-grey",
    },
    success: {
        icon: <CheckCircle2 className="w-5 h-5 text-add-green" />,
        className:
            "border-l-4 border-add-green bg-mono-white text-mono-dark-grey",
    },
    warning: {
        icon: <AlertTriangle className="w-5 h-5 text-add-dark-yellow" />,
        className:
            "border-l-4 border-add-dark-yellow bg-mono-white text-mono-dark-grey",
    },
    error: {
        icon: <AlertCircle className="w-5 h-5 text-add-red" />,
        className:
            "border-l-4 border-add-red bg-mono-white text-mono-dark-grey",
    },
};

export const showToast = (
    message: React.ReactNode,
    variant: ToastVariant = "info",
    options?: ToastOptions
) => {
    const config = variantConfig[variant];

    // className HANDLE: CAN USE string | function
    let finalClassName: ToastClassName = config.className;
    if (typeof options?.className === "string") {
        finalClassName = twMerge(
            "rounded-md shadow-s-300 px-4 py-3 flex items-center gap-3",
            config.className,
            options.className
        );
    } else if (typeof options?.className === "function") {
        finalClassName = options.className;
    } else {
        finalClassName = twMerge(
            "rounded-md shadow-s-300 px-4 py-3 flex items-center gap-3",
            config.className
        );
    }
    if (variant == "info") {
        toast.info(message, {
            icon: options?.icon ?? config.icon,
            className: finalClassName,
            progressClassName: "bg-mono-grey",
            closeButton: (
                <button className="ml-2 text-mono-grey hover:text-mono-black">
                    <X className="w-4 h-4" />
                </button>
            ),
            autoClose: 10000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: "touch",
            transition: Slide,
            ...options,
        });
    } else if (variant == "success") {
        toast.success(message, {
            icon: options?.icon ?? config.icon,
            className: finalClassName,
            progressClassName: "bg-mono-grey",
            closeButton: (
                <button className="ml-2 text-mono-grey hover:text-mono-black">
                    <X className="w-4 h-4" />
                </button>
            ),
            autoClose: 10000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: "touch",
            transition: Slide,
            ...options,
        });
    } else if (variant == "warning") {
        toast.warn(message, {
            icon: options?.icon ?? config.icon,
            className: finalClassName,
            progressClassName: "bg-mono-grey",
            closeButton: (
                <button className="ml-2 text-mono-grey hover:text-mono-black">
                    <X className="w-4 h-4" />
                </button>
            ),
            autoClose: 10000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: "touch",
            transition: Slide,
            ...options,
        });
    } else if (variant == "error") {
        toast.error(message, {
            icon: options?.icon ?? config.icon,
            className: finalClassName,
            progressClassName: "bg-mono-grey",
            closeButton: (
                <button className="ml-2 text-mono-grey hover:text-mono-black">
                    <X className="w-4 h-4" />
                </button>
            ),
            autoClose: 10000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: "touch",
            transition: Slide,
            ...options,
        });
    } else {
        toast(message, {
            icon: options?.icon ?? config.icon,
            className: finalClassName,
            progressClassName: "bg-mono-grey",
            closeButton: (
                <button className="ml-2 text-mono-grey hover:text-mono-black">
                    <X className="w-4 h-4" />
                </button>
            ),
            autoClose: 10000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: "touch",
            transition: Slide,
            ...options,
        });
    }
};

export const ToastProvider = () => (
    <ToastContainer
        position="top-right"
        newestOnTop
        closeOnClick={false}
        draggable
        pauseOnHover
    />
);
