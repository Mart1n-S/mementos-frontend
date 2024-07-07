import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from '@/modules/axios';
import type { Categorie } from '@/models/Categorie';

export const useCategorieStore = defineStore('categorie', () => {
    const categories = ref<Categorie[]>([]);
    const errorMessage = ref<string | null>(null);

    function getLocalStorageCategories() {
        const categoriesString = localStorage.getItem('categories');
        return categoriesString ? JSON.parse(categoriesString) : null;
    }

    function setLocalStorageCategories(categories: Categorie[]) {
        localStorage.setItem('categories', JSON.stringify(categories));
        localStorage.setItem('categoriesTimestamp', Date.now().toString());
    }

    async function fetchCategories() {
        const localCategories = getLocalStorageCategories();
        const lastFetch = localStorage.getItem('categoriesTimestamp');
        const now = Date.now();

        // Vérifier si les catégories locales sont présentes et si elles sont récentes (par exemple, moins de 1 heure)
        if (localCategories && lastFetch && now - parseInt(lastFetch) < 3600000) {
            categories.value = localCategories;
        } else {
            try {
                const response = await axios.get<Categorie[]>('/categories');
                categories.value = response.data;
                setLocalStorageCategories(response.data);
            } catch (error: any) {
                errorMessage.value = 'Erreur lors de la récupération des catégories';
                console.error('Erreur lors de la récupération des catégories:', error);
            }
        }
    }

    async function refreshCategories() {
        try {
            const response = await axios.get<Categorie[]>('/categories');
            categories.value = response.data;
            setLocalStorageCategories(response.data);
        } catch (error: any) {
            errorMessage.value = 'Erreur lors de la mise à jour des catégories';
            console.error('Erreur lors de la mise à jour des catégories:', error);
        }
    }

    return { categories, errorMessage, fetchCategories, refreshCategories };
});
