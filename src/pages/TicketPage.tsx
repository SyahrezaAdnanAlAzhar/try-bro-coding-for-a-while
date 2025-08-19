import { Button } from '../components/ui/Button';
import { Text } from '../components/ui/Text';
import { useAuthStatus } from '../store/authStore';

export default function TicketPage() {
    const authStatus = useAuthStatus();
    const isLoggedIn = authStatus === 'authenticated';

    return (
        <div className="space-y-6">
            <Text as="h1" variant="display" weight="bold">
                Ini Page Ticket
            </Text>

            <div className="p-4 border rounded-md">
                <Text>Ini adalah konten yang bisa dilihat semua orang.</Text>
            </div>

            {isLoggedIn && (
                <div className="p-4 border border-green-500 bg-green-50 rounded-md">
                    <Text weight="bold">Konten Khusus Pengguna Login</Text>
                    <Text>Anda bisa melihat ini karena Anda sudah login.</Text>
                    <Button className="mt-2">Aksi Khusus</Button>
                </div>
            )}

            {!isLoggedIn && (
                <div className="p-4 border border-yellow-500 bg-yellow-50 rounded-md">
                    <Text weight="bold">Anda adalah Tamu</Text>
                    <Text>Silakan masuk untuk mengakses fitur lengkap.</Text>
                </div>
            )}
        </div>
    );
}