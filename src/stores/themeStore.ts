import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from '@/modules/axios';
import type { Theme } from '@/models/Theme';

export const useThemeStore = defineStore('theme', () => {
    const themes = ref<Theme[]>([]);
    const errorMessage = ref<string | null>(null);

    async function fetchThemesByCategory(category: string) {
        try {
            const response = await axios.get<Theme[]>(`/themes/${category}`);
            themes.value = response.data;
        } catch (error: any) {
            errorMessage.value = 'Erreur lors de la récupération des thèmes';
            console.error('Erreur lors de la récupération des thèmes:', error);
        }
    }

    async function fetchUserThemes(userId: number) {
        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.get<Theme[]>(`/user/${userId}/themes`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            themes.value = response.data;
        } catch (error: any) {
            errorMessage.value = 'Erreur lors de la récupération des thèmes de l\'utilisateur';
            console.error('Erreur lors de la récupération des thèmes de l\'utilisateur:', error);
        }
    }

    return { themes, errorMessage, fetchThemesByCategory, fetchUserThemes };
});
