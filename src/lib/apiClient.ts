import { useAuthStore } from "../store/authStore";

let isRefreshing = false;
let failedQueue: { resolve: (value: any) => void; reject: (reason?: any) => void }[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

export const apiClient = async (url: string, options: RequestInit = {}): Promise<Response> => {
    const { accessToken, actions } = useAuthStore.getState();

    if (accessToken) {
        options.headers = {
            ...options.headers,
            Authorization: `Bearer ${accessToken}`,
        };
    }

    let response = await fetch(url, options);

    if (response.status === 401) {
        if (!isRefreshing) {
            isRefreshing = true;
            try {
                const newAccessToken = await actions.refreshToken();
                if (newAccessToken) {
                    options.headers = {
                        ...options.headers,
                        Authorization: `Bearer ${newAccessToken}`,
                    };
                    response = await fetch(url, options);
                    processQueue(null, newAccessToken);
                } else {
                    throw new Error('Session expired. Please log in again.');
                }
            } catch (error) {
                processQueue(error, null);
                actions.logout(); 
                return Promise.reject(error);
            } finally {
                isRefreshing = false;
            }
        } else {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            }).then(() => {
                const newAccessToken = useAuthStore.getState().accessToken;
                options.headers = {
                    ...options.headers,
                    Authorization: `Bearer ${newAccessToken}`,
                };
                return fetch(url, options);
            });
        }
    }

    return response;
};