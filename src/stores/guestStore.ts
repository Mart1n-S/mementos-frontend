import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { addGuestData, getGuestData, updateGuestDataInDB, clearGuestData } from '@/utils/indexedDB';

export const useGuestStore = defineStore('guest', () => {
    const guestData = ref<{ id?: number; pseudo: string; niveauRevision: number } | null>(null);
    const successMessage = ref<string | null>(null);
    const errorMessage = ref<string | null>(null);

    /**
     * Enregistre les données du visiteur
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

    return {
        guestData,
        successMessage,
        errorMessage,
        setGuestData,
        deleteAllDataGuest,
        loadGuestData,
        updateGuestData,
        isGuest
    };
});
