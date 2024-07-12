import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from '@/modules/axios';
import type { Theme } from '@/models/Theme';

export const useThemeStore = defineStore('theme', () => {
    const themes = ref<Theme[]>([]);
    const theme = ref<Theme | null>(null);
    const errorMessage = ref<string | null>(null);
    const validationErrors = ref<{ [key: string]: string[] } | null>(null);

    /**
     * Récupère les thèmes publiques par catégorie
     * @param category 
     */
    async function fetchThemesByCategory(category: string) {
        try {
            const response = await axios.get<Theme[]>(`/themes/${category}`);
            themes.value = response.data;
        } catch (error: any) {
            errorMessage.value = 'Erreur lors de la récupération des thèmes';
            console.error('Erreur lors de la récupération des thèmes:', error);
        }
    }

    /**
     * Récupère les thèmes de l'utilisateur
     * @param userId 
     */
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

    /**
     * Récupère un thème par son identifiant
     * @param themeId 
     */
    async function fetchThemeById(themeId: string) {
        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.get<Theme>(`/themes/infos/${themeId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            theme.value = response.data;
        } catch (error: any) {
            errorMessage.value = 'Erreur lors de la récupération du thème';
            console.error('Erreur lors de la récupération du thème:', error);
        }
    }

    /**
     * Crée un nouveau thème
     * @param newTheme 
     */
    async function createTheme(newTheme: { nom: string; category_id: number | null; public: boolean; cards: { question: string; reponse: string; }[] }) {
        try {
            validationErrors.value = null;
            const token = localStorage.getItem('access_token');
            const response = await axios.post('/themes', newTheme, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            themes.value.push(response.data);
        } catch (error: any) {
            if (error.response && error.response.status === 422) {
                validationErrors.value = error.response.data.errors;
            } else {
                errorMessage.value = 'Erreur lors de la création du thème';
                console.error('Erreur lors de la création du thème:', error);
            }
        }
    }

    /**
     * Met à jour un thème
     * @param themeId 
     * @param updatedData 
     */
    async function updateTheme(themeId: string, updatedData: { nom: string; category_id: number | null; public: boolean }) {
        try {
            validationErrors.value = null;
            const token = localStorage.getItem('access_token');
            const response = await axios.put(`/themes/${themeId}`, updatedData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            // Mettre à jour le thème dans la liste des thèmes
            const index = themes.value.findIndex(theme => theme.id === parseInt(themeId));
            if (index !== -1) {
                themes.value[index] = response.data;
            }
            // Mettre à jour le thème actuel si c'est le même thème
            if (theme.value && theme.value.id === parseInt(themeId)) {
                theme.value = response.data;
            }
        } catch (error: any) {
            if (error.response && error.response.status === 422) {
                validationErrors.value = error.response.data.errors;
            } else {
                errorMessage.value = 'Erreur lors de la mise à jour du thème';
                console.error('Erreur lors de la mise à jour du thème:', error);
            }
        }
    }

    /**
     * Supprime un thème
     * @param themeId 
     */
    async function deleteTheme(themeId: number) {
        try {
            const token = localStorage.getItem('access_token');
            await axios.delete(`/themes/${themeId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            themes.value = themes.value.filter(theme => theme.id !== themeId);
            if (theme.value && theme.value.id === themeId) {
                theme.value = null;
            }
        } catch (error: any) {
            errorMessage.value = 'Erreur lors de la suppression du thème';
            console.error('Erreur lors de la suppression du thème:', error);
        }
    }

    return { themes, theme, errorMessage, validationErrors, fetchThemesByCategory, fetchUserThemes, fetchThemeById, createTheme, updateTheme, deleteTheme };
});
