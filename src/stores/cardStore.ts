import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from '@/modules/axios';
import type { Carte } from '@/models/Carte';

export const useCardStore = defineStore('card', () => {
    const cards = ref<Carte[]>([]);
    const errorMessage = ref<string | null>(null);

    async function fetchCardsByTheme(themeId: number) {
        try {
            const response = await axios.get<Carte[]>(`/themes/${themeId}/cards`);
            cards.value = response.data;
        } catch (error: any) {
            errorMessage.value = 'Erreur lors de la récupération des cartes';
            console.error('Erreur lors de la récupération des cartes:', error);
        }
    }

    return { cards, errorMessage, fetchCardsByTheme };
});

