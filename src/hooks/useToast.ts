import { showToast } from "../components/ui/Toast";
import type { ToastOptions } from "react-toastify";
import React, { useMemo } from "react";

type Variant = "info" | "success" | "warning" | "error";

export const useToast = () => {
    const toastApi = useMemo(
        () => ({
            info: (message: React.ReactNode, options?: ToastOptions) =>
                showToast(message, "info", options),
            success: (message: React.ReactNode, options?: ToastOptions) =>
                showToast(message, "success", options),
            warning: (message: React.ReactNode, options?: ToastOptions) =>
                showToast(message, "warning", options),
            error: (message: React.ReactNode, options?: ToastOptions) =>
                showToast(message, "error", options),
            custom: (
                message: React.ReactNode,
                variant: Variant,
                options?: ToastOptions
            ) => showToast(message, variant, options),
        }),
        []
    );

    return toastApi;
};