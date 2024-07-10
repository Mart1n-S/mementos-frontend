import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from '@/modules/axios';
import type { Categorie } from '@/models/Categorie';

export const useCategorieStore = defineStore('categorie', () => {
    const categories = ref<Categorie[]>([]);
    const errorMessage = ref<string | null>(null);

    /**
     * Récupère les catégories publiques
     */
    async function fetchCategories() {
        try {
            const response = await axios.get<Categorie[]>('/categories');
            categories.value = response.data;
        } catch (error: any) {
            errorMessage.value = 'Erreur lors de la récupération des catégories';
            console.error('Erreur lors de la récupération des catégories:', error);
        }
    }

    return { categories, errorMessage, fetchCategories };
});
