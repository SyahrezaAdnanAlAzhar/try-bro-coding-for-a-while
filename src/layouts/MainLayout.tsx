import { Navbar } from './Navbar';
import { WebSocketProvider } from '../providers/WebSocketProvider';
import { type ReactNode } from 'react';

interface MainLayoutProps {
    children: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
    return (
        <WebSocketProvider>
            <div className="flex min-h-screen flex-col bg-mono-white">
                <Navbar />
                <main className="flex-grow px-16 py-8 sm:px-6 lg:px-16">
                    {children}
                </main>
            </div>
        </WebSocketProvider>
    );
};