<template>
    <div class="flex flex-col items-center min-h-screen py-10 bg-white rounded-t-3xl">
        <h1 class="mb-8 text-5xl font-bold text-center">Créer un Thème</h1>
        <form class="w-full max-w-md px-4" @submit.prevent="submitForm">
            <p v-if="validationErrors.global" class="mt-2 mb-4 text-lg text-center text-red-600 dark:text-red-500">
                <span class="font-medium">Oops!</span> {{ validationErrors.global }}
            </p>
            <div v-if="isLoading" role="status" class="text-center">
                <svg aria-hidden="true"
                    class="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-green-500"
                    viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor" />
                    <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill" />
                </svg>
                <span class="sr-only">Loading...</span>
            </div>
            <div class="mb-6">
                <label for="categorie"
                    class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Catégorie</label>
                <select v-model="selectedCategory" id="categorie" name="categorie"
                    class="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                    required>
                    <option value="" disabled selected>Choisir une catégorie</option>
                    <option v-for="categorie in categories" :key="categorie.id" :value="categorie.id">
                        {{ categorie.nom }}
                    </option>
                </select>
                <p v-if="validationErrors.category_id" class="mt-2 text-sm text-red-600 dark:text-red-500">
                    <span class="font-medium">Oops!</span> {{ validationErrors.category_id[0] }}
                </p>
            </div>
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
            <div v-if="!isGuest" class="mb-6">
                <label for="state" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Etat</label>
                <select v-model="selectedState" id="state" name="state"
                    class="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                    required>
                    <option value="true">Public</option>
                    <option value="false">Privé</option>
                </select>
                <p v-if="validationErrors.public" class="mt-2 text-sm text-red-600 dark:text-red-500">
                    <span class="font-medium">Oops!</span> {{ validationErrors.public[0] }}
                </p>
            </div>
            <div v-for="(card, index) in cards" :key="index" class="mb-4">
                <QuestionReponse :index="index" :question="card.question" :reponse="card.reponse"
                    :errors="getCardErrors(index)" @remove="removeCard(index)" @update="updateCard(index, $event)" />
            </div>
            <button type="button" @click="addCard"
                class="btn btn-primary mb-5 w-full px-4 py-2 rounded-[3px] text-[20px] text-white font-semibold h-[49px] bg-[#2698E2] md:hover:bg-[#46a9ef]">
                Ajouter une carte
            </button>
            <button type="submit"
                class="btn btn-primary w-full px-4 py-2 rounded-[3px] text-[20px] text-white font-semibold h-[49px] bg-[#40C69F] md:hover:bg-[#47ffcb]">
                Sauvegarder
            </button>
        </form>
    </div>
</template>

<script lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import QuestionReponse from '@/components/QuestionReponse.vue';
import { useCategorieStore } from '@/stores/categorieStore';
import { useNotificationStore } from '@/stores/notificationStore';
import { useThemeStore } from '@/stores/themeStore';
import { useGuestStore } from '@/stores/guestStore';
import type { Categorie } from '@/models/Categorie';

export default {
    name: 'ThemeForm',
    components: {
        QuestionReponse,
    },
    setup() {
        const categorieStore = useCategorieStore();
        const themeStore = useThemeStore();
        const notificationStore = useNotificationStore();
        const guestStore = useGuestStore();
        const router = useRouter();
        const isLoading = ref(false);
        const categories = ref<Categorie[]>([]);

        onMounted(async () => {
            await categorieStore.fetchCategories();
            categories.value = categorieStore.categories;
            categories.value.sort((a, b) => a.nom.localeCompare(b.nom));
        });

        const selectedCategory = ref<string | null>('');
        const themeName = ref('');
        const selectedState = ref('true');
        const cards = ref<{ question: string; reponse: string; }[]>([
            { question: '', reponse: '' }
        ]);
        const validationErrors = ref<{ [key: string]: string[] }>({});

        const isGuest = computed(() => guestStore.isGuest);

        const addCard = () => {
            cards.value.push({ question: '', reponse: '' });
        };

        const removeCard = (index: number) => {
            if (cards.value.length > 1) {
                cards.value.splice(index, 1);
            }
        };

        const updateCard = (index: number, data: { question: string; reponse: string }) => {
            cards.value[index] = data;
        };

        const resetForm = () => {
            selectedCategory.value = '';
            themeName.value = '';
            selectedState.value = 'true';
            cards.value = [{ question: '', reponse: '' }];
            validationErrors.value = {};
        };

        const getCardErrors = (index: number) => {
            const errors: { question?: string[]; reponse?: string[] } = {};
            if (validationErrors.value[`cards.${index}.question`]) {
                errors.question = validationErrors.value[`cards.${index}.question`];
            }
            if (validationErrors.value[`cards.${index}.reponse`]) {
                errors.reponse = validationErrors.value[`cards.${index}.reponse`];
            }
            return errors;
        };

        const submitForm = async () => {
            isLoading.value = true;
            let themeData;

            if (isGuest.value) {
                const categorie = categories.value.find(categorie => categorie.id === parseInt(selectedCategory.value!));
                themeData = {
                    nom: themeName.value,
                    category_nom: categorie?.nom || '',
                    couleur: categorie?.couleur || '',
                };
                await guestStore.addGuestTheme(themeData, cards.value);
            } else {
                themeData = {
                    nom: themeName.value,
                    category_id: selectedCategory.value ? parseInt(selectedCategory.value) : null,
                    public: selectedState.value === 'true',
                    cards: cards.value,
                };
                await themeStore.createTheme(themeData);
            }

            isLoading.value = false;

            if (isGuest.value || (!themeStore.validationErrors || Object.keys(themeStore.validationErrors).length === 0)) {
                resetForm();
                notificationStore.setSuccessMessage('Votre thème a été créé avec succès.');
                router.push({ name: 'mes-themes' });
            } else {
                validationErrors.value = themeStore.validationErrors;
            }
        };

        return {
            categories,
            selectedCategory,
            themeName,
            selectedState,
            cards,
            validationErrors,
            addCard,
            removeCard,
            updateCard,
            submitForm,
            getCardErrors,
            isLoading,
            isGuest
        };
    },
};
</script>

<style scoped></style>