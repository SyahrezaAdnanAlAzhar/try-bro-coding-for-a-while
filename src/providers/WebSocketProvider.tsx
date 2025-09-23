import { useEffect, useState, createContext, useContext, useRef } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';
import { useAuthStore } from '../store/authStore';
import { useRealtimeStore } from '../store/realtimeStore';
import type { WebSocketMessage, Ticket, PriorityUpdatePayload } from '../types/api';
import { useToast } from '../hooks/useToast';
import { useTicketTableStore } from '../store/ticketTableStore';
import { useDepartmentStore } from '../store/departmentStore';
import { WEBSOCKET_URL } from '../config/api';
import { useJobStore } from '../store/jobStore';
import { useApprovalStore } from '../store/approvalStore';
import { useHistoryAllTicketStore } from '../store/historyAllTicketsStore';
import { useHistoryMyTicketStore } from '../store/historyMyTicketStore';
import { Text } from '../components/ui/Text';

const WebSocketContext = createContext<{ readyState: ReadyState } | null>(null);

export const WebSocketProvider = ({ children }: { children: React.ReactNode }) => {
    const { accessToken, actions: authActions } = useAuthStore();
    const { actions: realtimeActions } = useRealtimeStore();
    const [socketUrl, setSocketUrl] = useState<string | null>(null);
    const hasAttemptedConnection = useRef(false);

    const toast = useToast();
    const ticketTableActions = useTicketTableStore((state) => state.actions);
    const selectedDepartmentId = useDepartmentStore((state) => state.selectedDepartmentId);
    const jobActions = useJobStore((state) => state.actions);
    const approvalActions = useApprovalStore((state) => state.actions);
    const historyAllActions = useHistoryAllTicketStore((state) => state.actions);
    const historyMyActions = useHistoryMyTicketStore((state) => state.actions);

    useEffect(() => {
        if (hasAttemptedConnection.current || socketUrl) return;

        const getTicket = async () => {
            hasAttemptedConnection.current = true;
            let ticket: string | null = null;
            if (accessToken) {
                ticket = await authActions.requestWsTicket();
            } else {
                ticket = await authActions.requestPublicWsTicket();
            }

            if (ticket) {
                setSocketUrl(`${WEBSOCKET_URL}?ticket=${ticket}`);
            } else {
                hasAttemptedConnection.current = false;
            }
        };

        getTicket();
    }, [accessToken, socketUrl, authActions]);

    const { lastJsonMessage, readyState } = useWebSocket(
        socketUrl,
        {
            onOpen: () => {
                realtimeActions.setConnectionStatus('connected');
            },
            onClose: () => {
                realtimeActions.setConnectionStatus('disconnected');
            },
            onError: () => {
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

            switch (message.event) {
                case 'CONNECTION_ESTABLISHED': {
                    if (message.payload?.system_status) {
                        realtimeActions.setEditMode(message.payload.system_status);
                    }
                    break;
                }
                case 'SYSTEM_EDIT_MODE_CHANGED': {
                    realtimeActions.setEditMode(message.payload);
                    toast.warning(
                        <Text variant="body-sm">
                            Status sistem telah diubah oleh admin.
                        </Text>
                    );
                    break;
                }
                case 'TICKET_CREATED': {
                    const newTicket = message.payload as Ticket;
                    ticketTableActions.addOrUpdateTicket(newTicket);
                    jobActions.addOrUpdateJob(newTicket);
                    approvalActions.addOrUpdateApprovalTicket(newTicket);
                    historyAllActions.addOrUpdateHistoryTicket(newTicket);
                    historyMyActions.addOrUpdateMyHistoryTicket(newTicket);
                    toast.info(
                        <Text variant="body-sm">
                            Tiket baru <strong>#{newTicket.ticket_id}</strong> telah dibuat untuk departemen <strong>{newTicket.department_target_name}</strong>.
                        </Text>
                    );
                    break;
                }

                case 'TICKET_UPDATED':
                case 'TICKET_STATUS_CHANGED': {
                    const updatedTicket = message.payload as Ticket;
                    ticketTableActions.addOrUpdateTicket(updatedTicket);
                    jobActions.addOrUpdateJob(updatedTicket);
                    approvalActions.addOrUpdateApprovalTicket(updatedTicket);
                    historyAllActions.addOrUpdateHistoryTicket(updatedTicket);
                    historyMyActions.addOrUpdateMyHistoryTicket(updatedTicket);
                    toast.info(
                        <Text variant="body-sm">
                            Status untuk tiket <strong>#{updatedTicket.ticket_id}</strong> telah diperbarui menjadi <strong>{updatedTicket.current_status}</strong>.
                        </Text>
                    );
                    break;
                }

                case 'TICKET_PRIORITY_UPDATED': {
                    const payload = message.payload as PriorityUpdatePayload;
                    if (payload.department_target_id === selectedDepartmentId) {
                        toast.info('Urutan tiket diperbarui oleh pengguna lain.');
                        ticketTableActions.fetchTickets({ departmentId: selectedDepartmentId });
                    }
                    break;
                }

                case 'TICKET_PRIORITY_RECALCULATED': {
                    if (selectedDepartmentId) {
                        toast.info('Prioritas tiket telah dihitung ulang oleh sistem.');
                        ticketTableActions.fetchTickets({ departmentId: selectedDepartmentId });
                    }
                    break;
                }

                // POSTPONE
                // case 'EDITING_STARTED':
                //     realtimeActions.handleEditingStarted(message.payload as EditingPayload);
                //     break;
                // case 'EDITING_FINISHED':
                //     realtimeActions.handleEditingFinished(message.payload as EditingPayload);
                //     break;

                default:
                    console.warn(`Unhandled WebSocket event: ${message.event}`);
            }
        }
    }, [lastJsonMessage, realtimeActions, ticketTableActions, selectedDepartmentId, toast]);

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