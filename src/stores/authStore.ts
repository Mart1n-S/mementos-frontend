import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from '@/modules/axios';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', () => {
    const router = useRouter();
    const isAuthenticated = ref(false);
    const user = ref<{ name?: string; email?: string } | null>(null);
    const errorMessage = ref<string | null>(null);
    const successMessage = ref<string | null>(null);

    async function login(email: string, password: string) {
        try {
            const response = await axios.post('/login', { email, password });
            const token = response.data.token;
            // const userData = response.data.user;
            localStorage.setItem('access_token', token);
            errorMessage.value = null; // Vide le message d'erreur
            router.push('/'); // Rediriger vers la page d'accueil
        } catch (error: any) {
            if (error.response && error.response.status === 401) {
                errorMessage.value = 'Oops! Les identifiants sont incorrects.';
            } else {
                errorMessage.value = 'Erreur lors de la connexion.';
            }
        }
    }

    async function forgotPassword(email: string) {
        try {
            await axios.post('/forgot-password', { email });
            successMessage.value = 'Si un compte existe avec cet email, un email de réinitialisation vous sera envoyé.';
            errorMessage.value = null;
        } catch (error: any) {
            errorMessage.value = 'Erreur lors de l\'envoi de l\'email de réinitialisation.';
            successMessage.value = null;
        }
    }

    async function resetPassword(token: string, email: string, password: string, passwordConfirmation: string) {
        try {
            await axios.post('/reset-password', {
                token,
                email,
                password,
                password_confirmation: passwordConfirmation
            });
            successMessage.value = 'Mot de passe réinitialisé avec succès.';
            errorMessage.value = null;
            router.push({ name: 'connexion', query: { reset: 'success' } });
        } catch (error: any) {
            errorMessage.value = 'Erreur lors de la réinitialisation du mot de passe.';
            successMessage.value = null;
        }
    }

    async function logout() {
        try {
            const token = localStorage.getItem('access_token');
            await axios.post('/logout', {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            isAuthenticated.value = false;
            user.value = null;
            localStorage.removeItem('access_token');
            router.push('/');
        } catch (error) {
            console.error('Failed to logout:', error);
        }
    }

    function checkAuth() {
        const token = localStorage.getItem('access_token');
        if (token) {
            isAuthenticated.value = true;
            // Optionally, fetch and set the user data here
            // Example: user.value = { name: 'John Doe', email: 'john@example.com' };
        } else {
            isAuthenticated.value = false;
        }
    }

    function clearError() {
        errorMessage.value = null;
    }

    function clearSuccess() {
        successMessage.value = null;
    }

    return { isAuthenticated, user, errorMessage, successMessage, login, forgotPassword, resetPassword, logout, checkAuth, clearError, clearSuccess };
});

