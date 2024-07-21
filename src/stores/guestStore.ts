import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import {
    addGuestData, getGuestData, updateGuestDataInDB, clearGuestData, addTheme, getThemes, clearThemes as clearDBThemes,
    addCard, getCardsByTheme, clearCards as clearDBCards, deleteCard as deleteCardFromDB, deleteTheme as deleteThemeFromDB,
    addRevision, getRevisionsByCard, clearRevisions as clearDBRevisions, updateCard as updateCardInDB
} from '@/utils/indexedDB';
import { useNotificationStore } from './notificationStore';
export const useGuestStore = defineStore('guest', () => {
    const guestData = ref<{ id?: number; pseudo: string; niveauRevision: number } | null>(null);
    const successMessage = ref<string | null>(null);
    const errorMessage = ref<string | null>(null);
    const themes = ref<any[]>([]);
    const cards = ref<any[]>([]);
    const revisions = ref<any[]>([]);
    const notificationStore = useNotificationStore();

    /**
     * Enregistre les données du visiteur
     * @param data
    */
    const setGuestData = async (data: { pseudo: string; niveauRevision: number }) => {
        guestData.value = data;
        await addGuestData(data);
    };

    /**
     * Efface les données du visiteur
    */
    const deleteAllDataGuest = async () => {
        guestData.value = null;
        await clearGuestData();
    };

    /**
     * Charge les données du visiteur
    */
    const loadGuestData = async () => {
        const allGuestData = await getGuestData();
        if (allGuestData.length > 0) {
            guestData.value = allGuestData[0];
        }
    };

    /**
     * Met à jour les données du visiteur
     * @param data
    */
    const updateGuestData = async (data: { pseudo: string; niveauRevision: number }) => {
        if (guestData.value?.id) {
            await updateGuestDataInDB({ id: guestData.value.id, ...data });
            guestData.value = { id: guestData.value.id, ...data };
            successMessage.value = 'Informations mises à jour avec succès.';
        } else {
            errorMessage.value = 'Erreur lors de la mise à jour des informations.';
        }
    };

    /**
     * Indique si le visiteur est un invité
    */
    const isGuest = computed(() => {
        return guestData.value !== null;
    });

    /**
     * Ajoute un thème
     * @param theme
    */
    const addGuestTheme = async (theme: { nom: string; category_nom: string; couleur: string; }, cards: { question: string; reponse: string; }[]) => {
        const themeId = await addTheme(theme);
        if (typeof themeId === 'number') {
            for (const card of cards) {
                await addCard({ ...card, theme_id: themeId });
            }
        }
        await loadThemes();
    };

    /**
     * Charge les thèmes
     */
    const loadThemes = async () => {
        themes.value = await getThemes();
    };

    /**
     * Efface les thèmes
     */
    const clearThemes = async () => {
        themes.value = [];
        await clearDBThemes();
    };

    /**
     * Supprimer un thème
     * @param themeId
     */
    const deleteGuestTheme = async (themeId: number) => {
        await deleteThemeFromDB(themeId);
        // Reload themes after deletion
        await loadThemes();
    };

    /**
     * Ajoute une carte
     * @param card
     */
    const addGuestCard = async (card: { question: string; reponse: string; theme_id: number }) => {
        await addCard(card);
        await loadCards(card.theme_id);
    };


    /**
     * Met à jour une carte en particulier
     * @param card
     */
    const updateGuestCard = async (card: { id: number; question: string; reponse: string, theme_id: number }) => {
        try {
            await updateCardInDB(card);
            await loadCards(card.theme_id);
            notificationStore.setSuccessMessage('Carte mise à jour avec succès.');
        } catch (error) {
            notificationStore.setErrorMessage('Erreur lors de la mise à jour de la carte.');
        }
    };

    /** 
     * Charge les cartes
     * @param theme_id
     * */
    const loadCards = async (theme_id: number) => {
        cards.value = await getCardsByTheme(theme_id);
    };

    /**
     * Efface les cartes
     */
    const clearCards = async () => {
        cards.value = [];
        await clearDBCards();
    };

    /**
     * Supprimer une carte
     * @param cardId
     */
    const deleteGuestCard = async (cardId: number) => {
        await deleteCardFromDB(cardId);
        // Reload cards after deletion
        if (cards.value.length > 0) {
            await loadCards(cards.value[0].theme_id);
        }
    };

    /**
     * Ajoute une révision
     * @param revision
     */
    const addGuestRevision = async (revision: { carte_id: number; niveau: number; dateRevision: string; dateDerniereRevision?: string }) => {
        await addRevision(revision);
        await loadRevisions(revision.carte_id);
    };

    /**
     * Charge les révisions
     * @param carte_id
     */
    const loadRevisions = async (carte_id: number) => {
        revisions.value = await getRevisionsByCard(carte_id);
    };

    /**
     * Efface les révisions
     */
    const clearRevisions = async () => {
        revisions.value = [];
        await clearDBRevisions();
    };

    return {
        guestData,
        successMessage,
        errorMessage,
        setGuestData,
        deleteAllDataGuest,
        loadGuestData,
        updateGuestData,
        isGuest,
        clearGuestData,
        addGuestTheme,
        loadThemes,
        clearThemes,
        deleteGuestTheme,
        addGuestCard,
        updateGuestCard,
        loadCards,
        clearCards,
        deleteGuestCard,
        addGuestRevision,
        loadRevisions,
        clearRevisions,
        themes,
        cards,
        revisions,
    };
});
