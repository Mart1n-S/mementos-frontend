<template>
    <div :class="['fixed top-0 right-0 left-0 bg-[#80808070] z-50 min-h-screen justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full', { 'flex': isVisible, 'hidden': !isVisible }]"
        aria-hidden="true">
        <div class="relative w-full max-w-2xl max-h-full p-4">
            <!-- Modal content -->
            <div class="relative bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                <!-- Modal header -->
                <div class="flex justify-between bg-[#595D5F] p-4 mb-4 rounded-t sm:mb-5">
                    <h3 class="text-lg font-semibold text-white dark:text-white">Modifier Carte</h3>
                    <button type="button" @click="closeModal"
                        class="text-gray-400 bg-transparent md:hover:bg-gray-400 rounded-lg text-sm p-1.5 inline-flex dark:hover:bg-gray-600 dark:hover:text-white">
                        <svg aria-hidden="true" class="w-5 h-5" fill="#ffffff" viewbox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clip-rule="evenodd" />
                        </svg>
                        <span class="sr-only">Close modal</span>
                    </button>
                </div>
                <!-- Modal body -->
                <form @submit.prevent="submitForm">
                    <div class="grid gap-4 p-4 mb-4 sm:grid-cols-2">
                        <div class="mb-8 text-start">
                            <label for="question"
                                class="font-semibold leading-none text-[20px] text-gray-900 dark:text-white">Question</label>
                            <textarea v-model="form.question" id="question"
                                class="bg-gray-50 mt-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder="Entrez la question" style="min-height: 150px;">
                            </textarea>
                            <p v-if="validationErrors.question" class="mt-2 text-sm text-red-600 dark:text-red-500">
                                <span class="font-medium">Oops!</span> {{ validationErrors.question[0] }}
                            </p>
                        </div>
                        <div class="mb-8 text-start">
                            <label for="answer"
                                class="font-semibold leading-none text-[20px] text-gray-900 dark:text-white">Réponse</label>
                            <textarea v-model="form.answer" id="answer"
                                class="bg-gray-50 mt-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder="Entrez la réponse" style="min-height: 150px;">
                            </textarea>
                            <p v-if="validationErrors.reponse" class="mt-2 text-sm text-red-600 dark:text-red-500">
                                <span class="font-medium">Oops!</span> {{ validationErrors.reponse[0] }}
                            </p>
                        </div>
                    </div>
                    <div class="flex items-center justify-center p-4 space-x-4">
                        <button type="submit"
                            class="btn btn-primary px-4 py-2 rounded-[3px] text-[20px] text-white font-semibold h-[49px] bg-[#2698E2] md:hover:bg-[#46a9ef]">Sauvegarder</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, toRefs, type PropType } from 'vue';
import { useCardStore } from '@/stores/cardStore';
import { useGuestStore } from '@/stores/guestStore';
import { useAuthStore } from '@/stores/authStore';
import type { Carte } from '@/models/Carte';

export default defineComponent({
    props: {
        isVisible: {
            type: Boolean,
            required: true
        },
        card: {
            type: Object as PropType<Carte | null>,
            default: null
        }
    },
    setup(props, { emit }) {
        const form = ref({ question: '', answer: '' });
        const authStore = useAuthStore();
        const cardStore = useCardStore();
        const guestStore = useGuestStore();
        const { validationErrors } = toRefs(cardStore);

        // Etendre le type Carte localement pour ajouter theme_id
        type ExtendedCarte = Carte & { theme_id: number };

        const resetForm = () => {
            if (props.card) {
                form.value.question = props.card.question;
                form.value.answer = props.card.reponse;
                console.log('props.card', props.card);
            } else {
                form.value.question = '';
                form.value.answer = '';
            }
        };

        watch(() => props.card, () => {
            resetForm();
        }, { immediate: true });

        const closeModal = () => {
            validationErrors.value = {};
            resetForm();
            emit('close');
        };

        const closeDropdowMenuActions = () => {
            if (props.card) {
                const action = document.getElementById(`button-action-${props.card.id}`);
                if (action) {
                    action.click();
                }
            }
        };

        const submitForm = async () => {
            if (props.card) {
                if (authStore.isAuthenticated) {
                    await cardStore.updateCard(props.card.id, form.value.question, form.value.answer);
                    validationErrors.value = cardStore.validationErrors;
                } else if (guestStore.isGuest) {
                    const extendedCard = props.card as ExtendedCarte;
                    await guestStore.updateGuestCard({ id: extendedCard.id, question: form.value.question, reponse: form.value.answer, theme_id: extendedCard.theme_id });
                }
                if (!validationErrors.value || Object.keys(validationErrors.value).length === 0) {
                    closeModal();
                    closeDropdowMenuActions();
                } else {
                    resetForm();
                }
            }
        };

        return {
            form,
            closeModal,
            submitForm,
            validationErrors
        };
    }
});
</script>
