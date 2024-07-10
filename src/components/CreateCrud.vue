<template>
    <div v-if="isVisible" tabindex="-1" aria-hidden="true"
        class="fixed top-0 right-0 left-0 z-50 flex justify-center items-center bg-[#80808070] min-h-screen w-full h-[calc(100%-1rem)] max-h-full overflow-y-auto overflow-x-hidden">
        <div class="relative w-full max-w-2xl max-h-full p-4">
            <!-- Modal content -->
            <div class="relative p-4 bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                <!-- Modal header -->
                <div
                    class="flex items-center justify-between pb-4 mb-4 border-b rounded-t sm:mb-5 dark:border-gray-600">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Ajouter une carte</h3>
                    <button type="button"
                        class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                        @click="$emit('close')">
                        <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewbox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clip-rule="evenodd" />
                        </svg>
                        <span class="sr-only">Close modal</span>
                    </button>
                </div>
                <!-- Modal body -->
                <form @submit.prevent="createCard">
                    <div class="grid gap-4 mb-4 sm:grid-cols-1">
                        <div>
                            <label for="question"
                                class="block text-start mb-2 text-[20px] font-medium text-gray-900 dark:text-white">Question</label>
                            <textarea name="question" id="question" v-model="question"
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder="Question" style="min-height: 150px;"></textarea>
                            <p v-if="validationErrors.question" class="mt-2 text-sm text-red-600 dark:text-red-500">
                                <span class="font-medium">Oops!</span> {{ validationErrors.question[0] }}
                            </p>
                        </div>
                        <div>
                            <label for="reponse"
                                class="block text-start mb-2 text-[20px] font-medium text-gray-900 dark:text-white">Réponse</label>
                            <textarea name="reponse" id="reponse" v-model="reponse"
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder="Réponse" style="min-height: 150px;"></textarea>
                            <p v-if="validationErrors.reponse" class="mt-2 text-sm text-red-600 dark:text-red-500">
                                <span class="font-medium">Oops!</span> {{ validationErrors.reponse[0] }}
                            </p>
                        </div>
                    </div>
                    <button type="submit"
                        class="btn btn-primary px-4 py-2 rounded-[3px] text-[20px] text-white font-semibold h-[49px] bg-[#2698E2] md:hover:bg-[#46a9ef]">
                        Ajouter
                    </button>
                </form>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useCardStore } from '@/stores/cardStore';
import { useThemeStore } from '@/stores/themeStore';

export default defineComponent({
    props: {
        isVisible: {
            type: Boolean,
            required: true
        }
    },
    setup(props, { emit }) {
        const question = ref('');
        const reponse = ref('');
        const validationErrors = ref<{ [key: string]: string[] }>({});

        const themeStore = useThemeStore();
        const cardStore = useCardStore();

        const createCard = async () => {
            if (themeStore.theme) {
                await cardStore.createCard(themeStore.theme.id, question.value, reponse.value);
                if (!cardStore.validationErrors || Object.keys(cardStore.validationErrors).length === 0) {
                    // Réinitialiser les champs après soumission
                    question.value = '';
                    reponse.value = '';
                    // Fermer la modale après la création
                    emit('close');
                } else {
                    validationErrors.value = cardStore.validationErrors;
                }
            } else {
                console.error('Theme ID is not available');
            }
        };

        return {
            question,
            reponse,
            validationErrors,
            createCard
        };
    }
});
</script>

<style scoped></style>
