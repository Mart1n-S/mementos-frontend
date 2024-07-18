<template>
    <main>
        <section class="sm:ml-64 custom-gradient md:p-4">
            <div class="mt-14">
                <div class="flex flex-col items-center justify-center p-4 py-10 text-center text-white">
                    <BackButton />
                    <h1 class="mb-4 text-[50px] font-bold" v-if="theme">{{ theme.nom }}</h1>
                    <p class="mb-8 text-[24px] underline" v-if="theme">Auteur : {{ theme.user.pseudo }}</p>
                    <div v-if="authStore.user" class="flex flex-col w-full space-y-4 md:w-4/12">
                        <button v-if="!isAlreadyRevised && theme !== null" @click="handleRevise(theme.id)"
                            class="btn btn-primary px-4 py-2 rounded-[3px] text-[20px] text-white font-semibold h-[49px] bg-[#2698E2] md:hover:bg-[#46a9ef]">
                            Réviser
                        </button>
                        <button v-if="!isAuthor" @click="duplicateCurrentTheme"
                            class="btn btn-secondary px-4 py-2 rounded-[3px] text-[20px] text-white font-semibold h-[49px] bg-[#FF4F79] md:hover:bg-[#ff3c87]">
                            Dupliquer
                        </button>
                    </div>
                </div>

                <div class="min-h-screen py-10 bg-white rounded-t-3xl">
                    <div class="container px-4 mx-auto text-center sm:px-6">
                        <div v-if="isLoadingDuplicate" role="status" class="text-center">
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
                        <p v-if="successMessage" class="mt-2 mb-4 text-lg text-center text-green-600">
                            <span class="font-medium">Succès!</span> {{ successMessage }}
                        </p>
                        <p v-if="errorMessage" class="mt-2 mb-4 text-lg text-center text-red-600">
                            <span class="font-medium">Erreur!</span> {{ errorMessage }}
                        </p>
                        <h2 class="mb-4 text-[28px] font-bold" v-if="theme">Aperçu des cartes</h2>
                        <p class="mb-6 text-[18px]" v-if="theme">
                            Avant de te lancer dans la révision, regarde si le thème correspond bien à ce que tu veux
                            réviser. Tu peux dupliquer le thème pour l’adapter à tes besoins.
                        </p>
                        <div class="grid grid-cols-1 gap-8" v-if="theme">
                            <CardList v-for="card in cards" :key="card.id" :question="card.question"
                                :color="theme.couleur ?? '#2698E2'" :reponse="card.reponse" />
                        </div>
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
                    </div>
                </div>
            </div>
        </section>
    </main>
    <FooterComponent />
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useCardStore } from '@/stores/cardStore';
import { useAuthStore } from '@/stores/authStore';
import { useThemeStore } from '@/stores/themeStore';
import { useRevisionStore } from '@/stores/revisionStore';
import CardList from '@/components/CardList.vue';
import BackButton from '@/components/BackButton.vue';
import FooterComponent from '@/components/FooterComponent.vue';
import { useNotificationStore } from '@/stores/notificationStore';

// Accept themeId as prop
const props = defineProps<{ themeId: number }>();

const cardStore = useCardStore();
const authStore = useAuthStore();
const themeStore = useThemeStore();
const revisionStore = useRevisionStore();
const isLoading = ref(true);
const isLoadingDuplicate = ref(false);
const notificationStore = useNotificationStore();

const cards = computed(() => cardStore.cards);
const theme = computed(() => cards.value.length > 0 ? cards.value[0].theme : null);
const isAuthor = computed(() => {
    return theme.value && authStore.user ? theme.value.user.id === authStore.user.id : false;
});
const successMessage = computed(() => notificationStore.successMessage);
const errorMessage = computed(() => notificationStore.errorMessage);

const duplicateCurrentTheme = async () => {
    if (theme.value) {
        try {
            isLoadingDuplicate.value = true;
            await themeStore.duplicateTheme(theme.value.id);
            isLoadingDuplicate.value = false;
            notificationStore.setSuccessMessage('Le thème a été dupliqué avec succès');
        } catch (error: any) {
            notificationStore.setErrorMessage(error.response.data.error || 'Erreur lors de la duplication du thème');
            isLoadingDuplicate.value = false;
        }
    }
};

const handleRevise = async (id: number) => {
    await revisionStore.addToMyRevision(id);
};

const isAlreadyRevised = computed(() => {
    return revisionStore.themesRevision.some(theme => theme.id === props.themeId);
});

onMounted(async () => {
    await cardStore.fetchCardsByTheme(props.themeId);
    isLoading.value = false;

    if (authStore.user) {
        await revisionStore.fetchUserRevision(authStore.user.id);
    }
});
</script>

<style scoped></style>
