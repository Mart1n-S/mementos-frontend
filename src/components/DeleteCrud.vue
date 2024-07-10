<template>
    <div v-show="isVisible"
        class="overflow-y-auto bg-[#80808070] min-h-screen  overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full flex">
        <div class="relative w-full max-w-md max-h-full p-4">
            <!-- Modal content -->
            <div class="relative p-4 text-center bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                <button type="button"
                    class="text-gray-400 absolute top-2.5 right-2.5 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                    @click="closeModal">
                    <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clip-rule="evenodd" />
                    </svg>
                    <span class="sr-only">Close modal</span>
                </button>
                <svg class="text-gray-400 dark:text-gray-500 w-11 h-11 mb-3.5 mx-auto" aria-hidden="true" fill="#F05252"
                    viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clip-rule="evenodd" />
                </svg>
                <p class="my-8 text-gray-500 dark:text-gray-300">Êtes-vous sûr de vouloir supprimer cet
                    élément ? Cela
                    est définitif.</p>
                <div class="flex items-center justify-center space-x-4">
                    <button @click="closeModal" type="button" class="btn btn-primary px-4 py-2 rounded-[3px] text-[18px] text-gray-500 font-semibold h-[49px] bg-white
                    border border-gray-200
                    md:hover:bg-gray-100">Annuler</button>
                    <button @click="confirmDelete" type="button"
                        class=" btn btn-primary px-4 py-2 rounded-[3px] text-[18px] text-white font-semibold h-[49px] bg-red-600 md:bg-red-700">Supprimer</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useCardStore } from '@/stores/cardStore';
import type { PropType } from 'vue';

export default defineComponent({
    props: {
        isVisible: {
            type: Boolean,
            required: true
        },
        cardId: {
            type: Number as PropType<number | null>,
            default: null
        }
    },
    setup(props, { emit }) {
        const cardStore = useCardStore();

        const closeModal = () => {
            emit('close');
        };

        const confirmDelete = async () => {
            if (props.cardId !== null) {
                await cardStore.deleteCard(props.cardId);
                emit('confirm-delete', props.cardId);
                closeModal();
            }
        };

        return {
            closeModal,
            confirmDelete
        };
    }
});
</script>

<style scoped></style>
