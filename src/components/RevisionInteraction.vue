<template>
    <div>
        <div class="relative w-full bg-gray-200 rounded dark:bg-gray-700" style="height: 20px;">
            <div class="bg-[#2698E2] text-xs font-medium text-blue-100 text-center leading-none rounded transition-all duration-300"
                :style="{ width: progressPercentage + '%', height: '100%' }">
            </div>
            <div class="absolute inset-0 flex items-center justify-center text-lg text-black">
                {{ cardsDone }}/{{ totalCards }}
            </div>
        </div>


        <CardRevision :key="currentCard.id" :question="currentCard.question" :answer="currentCard.reponse"
            @flipped="showButtons = true" />
        <div v-if="showButtons" class="flex flex-col items-center mt-4">
            <p class="mt-4 text-[24px] font-semibold">Avez-vous bien répondu ?</p>
            <div class="flex flex-col w-full space-y-4 md:w-4/12">
                <button @click="handleAnswer(true)"
                    class="w-full px-4 mt-8 py-2 font-bold text-white text-[22px] bg-green-500 md:hover:bg-[#1a815f] rounded focus:outline-none focus:shadow-outline">Oui</button>
                <button @click="handleAnswer(false)"
                    class="w-full px-4 mt-8 py-2 font-bold text-white text-[22px] bg-red-500 md:hover:bg-[#ea364e] rounded focus:outline-none focus:shadow-outline">Non</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted } from 'vue';
import CardRevision from '@/components/CardRevision.vue';
import { useRevisionStore } from '@/stores/revisionStore';

export default defineComponent({
    components: {
        CardRevision
    },
    setup() {
        const revisionStore = useRevisionStore();
        const showButtons = ref(false);
        const currentCard = computed(() => revisionStore.cards[0]);
        const totalCards = ref(revisionStore.cards.length);

        const handleAnswer = async (isCorrect: boolean) => {
            if (currentCard.value) {
                await revisionStore.updateRevision(currentCard.value.id, isCorrect);
                showButtons.value = false;
            }
        };

        // Variables de progression
        const cardsDone = computed(() => revisionStore.cardsDone);
        const cardsRemaining = computed(() => totalCards.value - cardsDone.value);

        // Calcul de la progression
        const progressPercentage = computed(() => {
            if (totalCards.value === 0) return 0;
            return (cardsDone.value / totalCards.value) * 100;
        });

        onMounted(() => {
            totalCards.value = revisionStore.cards.length;
        });

        return {
            currentCard,
            showButtons,
            handleAnswer,
            totalCards,
            cardsDone,
            cardsRemaining,
            progressPercentage
        };
    }
});
</script>

<style scoped></style>
