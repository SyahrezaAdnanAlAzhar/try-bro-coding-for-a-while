import { Navbar } from './Navbar';
import { WebSocketProvider } from '../providers/WebSocketProvider';
import type { ReactNode } from 'react';

interface MainLayoutProps {
    children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
    return (
        <WebSocketProvider>
            <div className="flex min-h-screen flex-col bg-mono-white">
                <Navbar />
                <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>
        </WebSocketProvider>
    );
};