const API_HOST = import.meta.env.VITE_API_HOST || 'http://localhost:8080';
const API_PATH = import.meta.env.VITE_API_PATH || '/api/e-memo-job-reservation';

export const HTTP_BASE_URL = API_PATH

const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
const wsHost = API_HOST.replace(/^https?:\/\//, '');
export const WEBSOCKET_URL = `${wsProtocol}://${wsHost}${API_PATH}/ws`;