import { defineStore } from 'pinia';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import axios from '@/modules/axios';
import { ref, computed } from 'vue';
import {
    addGuestData, getGuestData, updateGuestDataInDB, clearGuestData, addTheme, getThemes, clearThemes as clearDBThemes,
    addCard, getCardsByTheme, clearCards as clearDBCards, deleteCard as deleteCardFromDB, deleteTheme as deleteThemeFromDB, deleteCardsByTheme, deleteRevisionsByCardIds,
    addRevision, getRevisionsByTheme, clearRevisions as clearDBRevisions, updateCard as updateCardInDB, updateTheme as updateThemeInDB, getThemeById as getGuestThemeById
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
     * Duplique un thème
     * @param themeId
     */
    const duplicateThemeForGuest = async (themeId: number) => {
        try {
            const response = await axios.get(`/themes/duplicate/guest/${themeId}`);
            const theme = response.data.theme;
            const cards = response.data.cards;

            if (theme && cards) {
                const newTheme = {
                    nom: theme.nom,
                    category_nom: theme.category_nom,
                    couleur: theme.couleur
                };
                await addGuestTheme(newTheme, cards.map((card: any) => ({ question: card.question, reponse: card.reponse })));
                notificationStore.setSuccessMessage('Thème dupliqué avec succès.');
            }
        } catch (error: any) {
            errorMessage.value = 'Erreur lors de la récupération des thèmes';
            console.error('Erreur lors de la récupération des thèmes:', error);
        }
    };

    /**
     * Met à jour un thème en particulier
     * @param theme
     */
    const updateGuestTheme = async (theme: { id: number; nom: string; category_nom: string; couleur: string }) => {
        try {
            await updateThemeInDB(theme);
            await loadThemes();
            notificationStore.setSuccessMessage('Thème mis à jour avec succès.');
        } catch (error) {
            notificationStore.setErrorMessage('Erreur lors de la mise à jour du thème.');
        }
    };

    /**
     * Récupère un thème par son ID
     * @param themeId
     */
    const fetchGuestTheme = async (themeId: number) => {
        try {
            const theme = await getGuestThemeById(themeId);
            if (theme) {
                return theme;
            } else {
                throw new Error('Thème introuvable');
            }
        } catch (error) {
            notificationStore.setErrorMessage('Erreur lors de la récupération du thème.');
        }
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
        // Supprimer les cartes associées au thème
        const cards = await getCardsByTheme(themeId);
        const cardIds = cards.map(card => card.id);

        await deleteCardsByTheme(themeId);

        // Supprimer les révisions associées aux cartes
        await deleteRevisionsByCardIds(cardIds);

        // Supprimer le thème
        await deleteThemeFromDB(themeId);

        // Recharger les thèmes après suppression
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
    const addGuestRevision = async (themeId: number) => {
        try {
            const cards = await getCardsByTheme(themeId);
            const dateRevision = format(new Date(), 'yyyy-MM-dd', { locale: fr });
            const revisionsToAdd = cards.map(card => ({
                carte_id: card.id,
                theme_id: themeId,
                niveau: 1,
                dateRevision: dateRevision,
                dateDerniereRevision: null
            }));

            for (const revision of revisionsToAdd) {
                await addRevision(revision);
            }
            await loadRevisions(themeId);
            notificationStore.setSuccessMessage('Les cartes ont été ajoutées aux révisions.');
        } catch (error) {
            notificationStore.setErrorMessage('Erreur lors de l\'ajout des cartes aux révisions.');
            console.error('Erreur lors de l\'ajout des cartes aux révisions:', error);
        }
    };
    /**
     * Charge les révisions en fonction du thème
     * @param theme_id
     */
    const loadRevisions = async (theme_id: number) => {
        revisions.value = await getRevisionsByTheme(theme_id);
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
        duplicateThemeForGuest,
        updateGuestTheme,
        fetchGuestTheme,
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
