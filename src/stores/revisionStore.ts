import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from '@/modules/axios';
import { useNotificationStore } from './notificationStore';
import type { Theme } from '@/models/Theme';
import type { Carte } from '@/models/Carte';

export const useRevisionStore = defineStore('revision', () => {
    const themesRevision = ref<Theme[]>([]);
    const notificationStore = useNotificationStore();
    const nextRevisionInDays = ref<number | null>(null);
    const cardRevisionDisponible = ref<number>(0);
    const cards = ref<Carte[]>([]);
    const detailCards = ref<any[]>([]);
    const cardsDone = ref(0);

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
            cardRevisionDisponible.value = response.data.cardRevisionDisponible;
            detailCards.value = response.data.detailCards;
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
            await axios.delete('/revision/deleteAll', {
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

    /**
     * Ajoute un thème à mes révisions
     * @param themeId 
     */
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

    /**
     * Envoie le nombre voulue de cartes à réviser pour aujourd'hui
     * et récupère les cartes
     * @param numberOfCards 
     */
    async function fetchCardsForToday(numberOfCards: number) {
        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.post<Carte[]>('/revision/nombre-cartes', { number_of_cards: numberOfCards }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            cards.value = response.data;
            cardsDone.value = 0;
        } catch (error) {
            console.error('Failed to fetch cards:', error);
        }
    }

    /**
     * Met à jour la révision d'une carte augmente de niveau ou retour niveau 1, voir la logique dans le backend
     * @param cardId 
     * @param isCorrect 
     */
    async function updateRevision(cardId: number, isCorrect: boolean) {
        try {
            const token = localStorage.getItem('access_token');
            await axios.put('/revision', { id: cardId, is_correct: isCorrect }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            cards.value = cards.value.filter(card => card.id !== cardId);
            cardsDone.value += 1;

            // Mettre à jour le nombre de cartes restantes dans le localStorage
            const currentNumberOfCards = parseInt(localStorage.getItem('numberOfCards') || '0', 10);
            if (currentNumberOfCards > 0) {
                const newNumberOfCards = currentNumberOfCards - 1;
                localStorage.setItem('numberOfCards', newNumberOfCards.toString());
            }
        } catch (error) {
            console.error('Failed to update revision:', error);
        }
    }

    return { themesRevision, fetchUserRevision, nextRevisionInDays, cardRevisionDisponible, deleteThemeFromRevision, deleteAllRevisions, addToMyRevision, fetchCardsForToday, cards, updateRevision, cardsDone, detailCards };
});
