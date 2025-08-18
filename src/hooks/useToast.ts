import { showToast } from "../components/Toast";
import type { ToastOptions } from "react-toastify";
import React from "react";

type Variant = "info" | "success" | "warning" | "error";

export const useToast = () => {
    return {
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
    };
};
