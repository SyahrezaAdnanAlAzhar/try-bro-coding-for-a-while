import { useNavigate } from 'react-router-dom';
import { useAuthActions, useAuthStatus } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { FormField } from '../components/ui/FormField';
import { Panel } from '../components/ui/Panel';
import { Text } from '../components/ui/Text';
import { useToast } from '../hooks/useToast';
import { useEffect, useState } from 'react';

interface FormErrors {
    npk?: string;
}

export default function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuthActions();
    const authStatus = useAuthStatus();
    const toast = useToast();

    const [formData, setFormData] = useState({ npk: '' });
    const [errors, setErrors] = useState<FormErrors>({});

    useEffect(() => {
        if (authStatus === 'authenticated') {
            navigate('/', { replace: true });
        }
    }, [authStatus, navigate]);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        if (!formData.npk.trim()) {
            newErrors.npk = 'NPK wajib di isi.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        const { success, message } = await login(formData.npk, formData.npk);

        if (success) {
            toast.success('Login successful!');
            navigate('/');
        } else {
            toast.error(
                <div>
                    <Text variant="body-md" weight="bold">
                        Login tidak berhasil
                    </Text>
                    {message && (
                        <Text variant="body-sm" weight="regular" color="mono-dark-grey">
                            {message}
                        </Text>
                    )}
                </div>
            );
        }
    };

    if (authStatus === 'loading' || authStatus === 'authenticated') {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Text>Loading...</Text>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-start justify-center bg-mono-white p-4">
            <Panel shadow="s-500" className="w-full max-w-md">
                <form onSubmit={handleLogin} className="flex flex-col gap-6" noValidate>
                    <Text as="h1" variant="heading-xl" weight="bold" className="text-center">
                        Login
                    </Text>
                    <FormField
                        label="NPK"
                        name="npk"
                        type="text"
                        value={formData.npk}
                        onChange={handleInputChange}
                        error={errors.npk}
                        placeholder='Masukkan NPK anda'
                    />
                    <Button type="submit" fullWidth variant="blue-mtm-dark" size="lg">
                        Masuk
                    </Button>
                </form>
            </Panel>
        </div>
    );
}