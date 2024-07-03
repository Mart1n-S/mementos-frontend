// stores/authStore.ts
import { defineStore } from 'pinia';
import type { User } from '@/models/User';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        isAuthenticated: false,
        user: null as User | null
    }),
    actions: {
        login(user: User) {
            this.isAuthenticated = true;
            this.user = user;
        },
        logout() {
            this.isAuthenticated = false;
            this.user = null;
        },
        checkAuth() {
            const token = localStorage.getItem('access_token');
            if (token) {
                this.isAuthenticated = true;
                // Optionally, set the user data
                // this.user = fetchUserDataFromToken(token);
            } else {
                this.isAuthenticated = false;
            }
        }
    }
});
