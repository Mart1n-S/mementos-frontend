<template>
    <div class="flex flex-col items-center min-h-screen py-10 bg-white rounded-t-3xl">
        <h1 class="mb-8 text-5xl font-bold">Modifier</h1>
        <form class="w-full max-w-md px-4" @submit.prevent="updateTheme">
            <p v-if="validationErrors.global" class="mt-2 mb-4 text-lg text-center text-red-600 dark:text-red-500">
                <span class="font-medium">Oops!</span> {{ validationErrors.global }}
            </p>
            <div class="mb-6">
                <label for="themeName" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nom du
                    Thème</label>
                <input v-model="themeName" type="text" id="themeName" name="themeName"
                    class="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                    required />
                <p v-if="validationErrors.nom" class="mt-2 text-sm text-red-600 dark:text-red-500">
                    <span class="font-medium">Oops!</span> {{ validationErrors.nom[0] }}
                </p>
            </div>
            <div class="mb-6">
                <label for="categorie"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Catégorie</label>
                <select v-model="selectedCategory" id="categorie" name="categorie"
                    class="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                    required>
                    <option v-for="categorie in categories" :key="categorie.id" :value="categorie.id">
                        {{ categorie.nom }}
                    </option>
                </select>
                <p v-if="validationErrors.categorie" class="mt-2 text-sm text-red-600 dark:text-red-500">
                    <span class="font-medium">Oops!</span> {{ validationErrors.categorie[0] }}
                </p>
            </div>
            <div class="mb-6">
                <label for="state" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Etat</label>
                <select v-model="selectedState" id="state" name="state"
                    class="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                    required>
                    <option value="true">Public</option>
                    <option value="false">Privé</option>
                </select>
                <p v-if="validationErrors.state" class="mt-2 text-sm text-red-600 dark:text-red-500">
                    <span class="font-medium">Oops!</span> {{ validationErrors.state[0] }}
                </p>
            </div>

            <button type="submit"
                class="w-full mb-8 px-4 py-2 font-bold text-white text-[22px] bg-[#2698E2] md:hover:bg-[#46a9ef] rounded focus:outline-none focus:shadow-outline">
                Sauvegarder
            </button>
            <button type="button" @click="showDeleteModal"
                class="w-full px-4 py-2 font-bold text-white text-[22px] bg-[#FF4F79] md:hover:bg-[#ff3c87] rounded focus:outline-none focus:shadow-outline">
                Supprimer
            </button>
        </form>
        <DeleteCrud :isVisible="isDeleteModalVisible" :themeId="parseInt(themeId)" @close="hideDeleteModal"
            @confirm-delete="handleThemeDeleted" />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useCategorieStore } from '@/stores/categorieStore';
import { useThemeStore } from '@/stores/themeStore';
import DeleteCrud from '@/components/DeleteCrud.vue';
import type { Categorie } from '@/models/Categorie';

export default defineComponent({
    components: {
        DeleteCrud,
    },
    setup() {
        const route = useRoute();
        const router = useRouter();
        const themeStore = useThemeStore();
        const categorieStore = useCategorieStore();

        const themeId = Array.isArray(route.params.themeId) ? route.params.themeId[0] : route.params.themeId;
        const themeName = ref('');
        const selectedCategory = ref<number | null>(null);
        const selectedState = ref('true');
        const validationErrors = ref<{ [key: string]: string[] }>({});
        const categories = ref<Categorie[]>([]);
        const isDeleteModalVisible = ref(false);

        onMounted(async () => {
            await categorieStore.fetchCategories();
            categories.value = categorieStore.categories;
            await themeStore.fetchThemeById(themeId);
            if (themeStore.theme) {
                themeName.value = themeStore.theme.nom;
                selectedCategory.value = themeStore.theme.category_id;
                selectedState.value = themeStore.theme.public ? 'true' : 'false';
            }
        });

        const updateTheme = async () => {
            await themeStore.updateTheme(themeId, {
                nom: themeName.value,
                category_id: selectedCategory.value,
                public: selectedState.value === 'true',
            });

            if (!themeStore.validationErrors || Object.keys(themeStore.validationErrors).length === 0) {
                router.push(`/mes-themes/gestion/${themeId}`);
            } else {
                validationErrors.value = themeStore.validationErrors;
            }
        };

        const showDeleteModal = () => {
            isDeleteModalVisible.value = true;
        };

        const hideDeleteModal = () => {
            isDeleteModalVisible.value = false;
        };

        const handleThemeDeleted = () => {
            router.push('/mes-themes');
        };

        return {
            themeName,
            selectedCategory,
            selectedState,
            categories,
            validationErrors,
            updateTheme,
            showDeleteModal,
            hideDeleteModal,
            isDeleteModalVisible,
            handleThemeDeleted,
            themeId,
        };
    },
});
</script>

<style></style>
