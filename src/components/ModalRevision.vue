<template>
    <div v-if="isVisible"
        class="overflow-y-auto bg-[#80808070] min-h-screen  overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full flex">
        <div class="relative w-full max-w-md max-h-full p-4">
            <!-- Modal content -->
            <div class="relative p-4 text-center bg-white rounded-lg shadow dark:bg-gray-800 sm:p-5">
                <p class="mb-8 text-[22px] font-bold">Combien de cartes voulez-vous réviser ?</p>
                <p class="mb-4 text-[18px]">Vous avez {{ cardRevisionDisponible }} cartes à réviser aujourd'hui.</p>
                <input type="number" v-model="numberOfCards" class="w-full p-2 mb-4 border rounded"
                    :max="cardRevisionDisponible" min="1">
                <div class="flex flex-col items-center justify-center space-y-4">
                    <button @click="confirm"
                        class="w-full px-4 mt-8 py-2 font-bold text-white text-[22px] bg-[#2698E2] md:hover:bg-[#46a9ef] rounded focus:outline-none focus:shadow-outline">Confirmer</button>
                    <RouterLink to="/mon-mementos" type="button"
                        class="w-full px-4 mt-8 py-2 font-bold text-white text-[22px] bg-[#FF4F79] md:hover:bg-[#ff3c87] rounded focus:outline-none focus:shadow-outline">
                        Annuler</RouterLink>
                </div>
            </div>
        </div>
    </div>
</template>


<script lang="ts">
import { ref, defineComponent } from 'vue';
import { useRevisionStore } from '@/stores/revisionStore';

export default defineComponent({
    props: {
        isVisible: {
            type: Boolean,
            required: true
        }
    },
    emits: ['confirm'],
    setup(props, { emit }) {
        const revisionStore = useRevisionStore();
        const numberOfCards = ref(1);

        const confirm = () => {
            emit('confirm', numberOfCards.value);
        };

        return {
            numberOfCards,
            confirm,
            cardRevisionDisponible: revisionStore.cardRevisionDisponible
        };
    }
});
</script>

<style scoped></style>
