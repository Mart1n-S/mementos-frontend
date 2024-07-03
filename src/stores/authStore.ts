import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from '@/modules/axios';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', () => {
    const router = useRouter();
    const isAuthenticated = ref(false);
    const user = ref<{ name?: string; email?: string } | null>(null);
    const errorMessage = ref<string | null>(null);

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

    return { isAuthenticated, user, login, errorMessage, logout, checkAuth, clearError };
});

