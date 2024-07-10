import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from '@/modules/axios';
import type { Carte } from '@/models/Carte';

export const useCardStore = defineStore('card', () => {
    const cards = ref<Carte[]>([]);
    const errorMessage = ref<string | null>(null);
    const validationErrors = ref<{ [key: string]: string[] }>({});

    /**
     * Récupère les cartes par l'id du thème
     * @param themeId 
     */
    async function fetchCardsByTheme(themeId: number) {
        try {
            const response = await axios.get<Carte[]>(`/themes/${themeId}/cards`);
            cards.value = response.data;
        } catch (error: any) {
            errorMessage.value = 'Erreur lors de la récupération des cartes';
            console.error('Erreur lors de la récupération des cartes:', error);
        }
    }

    /**
     * Récupère les cartes de l'utilisateur par l'id du thème
     * @param themeId 
     */
    async function fetchCardsOfUser(themeId: string) {
        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.get<Carte[]>(`/cartes/${themeId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            cards.value = response.data;
            errorMessage.value = null;
        } catch (error: any) {
            if (error.response && error.response.status === 403) {
                errorMessage.value = 'Accès non autorisé';
            } else {
                errorMessage.value = 'Erreur lors de la récupération des cartes';
            }
            console.error('Erreur lors de la récupération des cartes:', error);
        }
    }

    /**
     * Met à jour une carte de l'utilisateur 
     * @param cardId 
     * @param question
     * @param reponse 
     */
    async function updateCard(cardId: number, question: string, reponse: string) {
        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.put<Carte>(`/cartes/${cardId}`, { question, reponse }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            const index = cards.value.findIndex(card => card.id === cardId);
            if (index !== -1) {
                cards.value[index] = response.data;
            }
            validationErrors.value = {};
            errorMessage.value = null;
        } catch (error: any) {
            if (error.response && error.response.status === 422) {
                // console.log("Validation Errors:", error.response.data.messages);
                validationErrors.value = error.response.data.messages;
                console.log("Validation Errors:", validationErrors.value);
            } else {
                errorMessage.value = 'Erreur lors de la mise à jour de la carte';
                console.error('Erreur lors de la mise à jour de la carte:', error);
            }
        }
    }


    /**
     * Supprime une carte de l'utilisateur par son identifiant
     * @param cardId 
     */
    async function deleteCard(cardId: number) {
        try {
            const token = localStorage.getItem('access_token');
            await axios.delete(`/cartes/${cardId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            cards.value = cards.value.filter(card => card.id !== cardId);
        } catch (error: any) {
            errorMessage.value = 'Erreur lors de la suppression de la carte';
            console.error('Erreur lors de la suppression de la carte:', error);
        }
    }

    return { cards, errorMessage, validationErrors, fetchCardsByTheme, fetchCardsOfUser, updateCard, deleteCard };
});

