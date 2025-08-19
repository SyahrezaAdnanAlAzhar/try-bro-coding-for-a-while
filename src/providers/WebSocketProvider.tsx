import { useEffect, useState, createContext, useContext } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useAuthStore } from '../store/authStore';
import { useRealtimeStore } from '../store/realtimeStore';
import type { WebSocketMessage, EditingPayload } from '../types/api';

const WebSocketContext = createContext<{ readyState: ReadyState } | null>(null);

const WEBSOCKET_URL = 'ws://localhost:8080/api/e-memo-job-reservation/ws';

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
    const { accessToken, actions: authActions } = useAuthStore();
    const { actions: realtimeActions } = useRealtimeStore();
    const [socketUrl, setSocketUrl] = useState<string | null>(null);

    useEffect(() => {
        if (accessToken && !socketUrl) {
            authActions.requestWsTicket().then(ticket => {
                if (ticket) {
                    setSocketUrl(`${WEBSOCKET_URL}?ticket=${ticket}`);
                }
            });
        }
        else if (!accessToken && socketUrl) {
            setSocketUrl(null);
        }
    }, [accessToken, socketUrl, authActions]);

    const { lastJsonMessage, readyState } = useWebSocket(
        socketUrl,
        {
            onOpen: () => {
                console.log('WebSocket connection established.');
                realtimeActions.setConnectionStatus('connected');
            },
            onClose: () => {
                console.log('WebSocket connection closed.');
                realtimeActions.setConnectionStatus('disconnected');
            },
            onError: (event) => {
                console.error('WebSocket error:', event);
                realtimeActions.setConnectionStatus('disconnected');
            },
            shouldReconnect: (_closeEvent) => true, 
            reconnectInterval: 3000, 
        },
        !!socketUrl 
    );

    useEffect(() => {
        if (lastJsonMessage) {
            const message = lastJsonMessage as WebSocketMessage;
            console.log('Received WebSocket message:', message);

            switch (message.event) {
                case 'EDITING_STARTED':
                    realtimeActions.handleEditingStarted(message.payload as EditingPayload);
                    break;
                case 'EDITING_FINISHED':
                    realtimeActions.handleEditingFinished(message.payload as EditingPayload);
                    break;
                // POSTPONE NEXT MESSAGE
                default:
                    console.warn(`Unhandled WebSocket event: ${message.event}`);
            }
        }
    }, [lastJsonMessage, realtimeActions]);

    return (
        <WebSocketContext.Provider value={{ readyState }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useSocketStatus = () => {
    const context = useContext(WebSocketContext);
    if (!context) {
        throw new Error('useSocketStatus must be used within a WebSocketProvider');
    }
    return context.readyState;
};