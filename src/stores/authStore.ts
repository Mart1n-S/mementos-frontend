import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from '@/modules/axios';
import { useRouter } from 'vue-router';

export const useAuthStore = defineStore('auth', () => {
    const router = useRouter();
    const isAuthenticated = ref(false);
    const user = ref<{ name?: string; email?: string } | null>(null);

    function login(userData: { name: string; email: string }) {
        isAuthenticated.value = true;
        user.value = userData;
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

    return { isAuthenticated, user, login, logout, checkAuth };
});

