import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateTicket, useCreateTicketActions } from '../store/createTicketStore';
import { Panel } from '../components/ui/Panel';
import { Text } from '../components/ui/Text';
import { Button } from '../components/ui/Button';
// import { FormField } from '../components/ui/FormField';
// import { Combobox, type ComboboxOption } from '../components/ui/Combobox';
// import { FileInput } from '../components/ui/FileInput';
import { useToast } from '../hooks/useToast';
import { CreateTicketForm } from '../components/features/ticket/CreateTicketForm';

export default function CreateTicketPage() {
    const { status } = useCreateTicket();
    const { fetchInitialData, submitTicket, reset } = useCreateTicketActions();
    const navigate = useNavigate();
    const toast = useToast();

    useEffect(() => {
        fetchInitialData();
        return () => {
            reset();
        };
    }, [fetchInitialData, reset]);

    const handleSubmit = async () => {
        const success = await submitTicket();
        if (success) {
            toast.success('Tiket berhasil dibuat!');
            navigate('/');
        } else {
            toast.error('Gagal membuat tiket. Periksa kembali isian Anda.');
        }
    };

    return (
        <div className="mx-auto max-w-4xl">
            <Panel shadow="s-200">
                <div className="flex flex-col gap-8">
                    <Text as="h1" variant="heading-xl" weight="bold" className="text-center">
                        Tambah Job Reservation
                    </Text>

                    {status === 'loading' && <Text className="text-center">Memuat data form...</Text>}
                    {status === 'error' && <Text color="add-red" className="text-center">Gagal memuat data.</Text>}

                    {status !== 'loading' && <CreateTicketForm />}

                    <div className="flex justify-end gap-4">
                        <Button variant="secondary" onClick={() => navigate('/')}>
                            Batal
                        </Button>
                        <Button
                            variant="primary-green"
                            onClick={handleSubmit}
                            isLoading={status === 'submitting'}
                        >
                            Kirim
                        </Button>
                    </div>
                </div>
            </Panel>
        </div>
    );
}