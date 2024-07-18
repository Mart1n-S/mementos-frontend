import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from '@/modules/axios';
import { useNotificationStore } from './notificationStore';
import type { Theme } from '@/models/Theme';

export const useRevisionStore = defineStore('revision', () => {
    const themesRevision = ref<Theme[]>([]);
    const notificationStore = useNotificationStore();
    const nextRevisionInDays = ref<number | null>(null);

    /**
     * Récupère les révisions de l'utilisateur
     * @param userId 
     */
    async function fetchUserRevision(userId: number) {
        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.get(`/revision/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            themesRevision.value = response.data.themes;
            nextRevisionInDays.value = response.data.nextRevisionInDays;
        } catch (error: any) {
            notificationStore.setErrorMessage('Erreur lors de la récupération des révisions de l\'utilisateur');
            console.error('Erreur lors de la récupération des révisions de l\'utilisateur:', error);
        }
    }

    /**
     * Supprime un thème des révisions de l'utilisateur
     * @param themeId 
     */
    async function deleteThemeFromRevision(themeId: number) {
        try {
            const token = localStorage.getItem('access_token');
            await axios.delete(`/revision/${themeId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            themesRevision.value = themesRevision.value.filter(theme => theme.id !== themeId);
            notificationStore.setSuccessMessage('Thème supprimé des révisions avec succès.');
        } catch (error: any) {
            notificationStore.setErrorMessage('Erreur lors de la suppression du thème des révisions.');
            console.error('Erreur lors de la suppression du thème des révisions:', error);
        }
    }

    /**
    * Supprime toutes les révisions de l'utilisateur
    */
    async function deleteAllRevisions() {
        try {
            const token = localStorage.getItem('access_token');
            await axios.delete('/deleteAll/revision', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            themesRevision.value = [];
            notificationStore.setSuccessMessage('Votre mementos a été supprimé avec succès.');
        } catch (error: any) {
            notificationStore.setErrorMessage('Erreur lors de la suppression de votre mementos.');
            console.error('Erreur lors de la suppression des révisions:', error);
        }
    }

    async function addToMyRevision(themeId: number) {
        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.post(`/revision/${themeId}`, {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            notificationStore.setSuccessMessage('Thème ajouté à vos révisions.');
            themesRevision.value.push(response.data[0]);
        } catch (error: any) {
            const errorMessage = error.response?.data?.error || 'Erreur lors de l\'ajout du thème à vos révisions';
            notificationStore.setErrorMessage(`${errorMessage}`);
            console.error('Erreur lors de l\'ajout du thème à vos révisions:', error);
        }
    }

    return { themesRevision, fetchUserRevision, nextRevisionInDays, deleteThemeFromRevision, deleteAllRevisions, addToMyRevision };
});
