<template>
    <div :class="['fixed top-0 right-0 left-0 bg-[#80808070] z-50 min-h-screen justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full', { 'flex': isVisible, 'hidden': !isVisible }]"
        aria-hidden="true">
        <div class="relative w-full max-w-xl max-h-full p-2">
            <!-- Modal content -->
            <div class="relative bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                <!-- Modal header -->
                <div class="flex justify-between bg-[#595D5F] p-4 mb-4 rounded-t sm:mb-5">
                    <h3 class="text-lg font-semibold text-white dark:text-white">Détails de la carte</h3>
                    <button type="button"
                        class="text-gray-400 bg-transparent md:hover:bg-gray-400 rounded-lg text-sm p-1.5 inline-flex dark:hover:bg-gray-600 dark:hover:text-white"
                        @click="closeModal">
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
                <div v-if="card" class="p-4">
                    <p class="mb-3 font-semibold leading-none text-[20px] text-gray-900 text-start dark:text-white">
                        Question</p>
                    <p class="mb-4 font-medium text-gray-500 sm:mb-5 dark:text-gray-400">{{ card.question }}
                    </p>
                    <p class="mb-3 font-semibold leading-none text-[20px] text-gray-900 text-start dark:text-white">
                        Réponse</p>
                    <p class="mb-4 font-medium text-[#40C69F] sm:mb-5 dark:text-gray-400">{{ card.reponse }}
                    </p>
                </div>
                <div v-else>
                    <p class="text-gray-500 dark:text-gray-400">Aucune carte n'est sélectionnée.</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from 'vue';
import type { Carte } from '@/models/Carte';

export default defineComponent({
    props: {
        card: {
            type: Object as PropType<Carte | null>,
            default: null
        },
        isVisible: {
            type: Boolean,
            required: true
        }
    },
    methods: {
        closeModal() {
            this.$emit('close');
        }
    }
});
</script>

<style scoped></style>
