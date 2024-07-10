<template>
    <div class="min-h-screen py-10 bg-white rounded-t-3xl">
        <div class="container flex flex-col items-center justify-center text-center">
            <!-- Start block -->
            <div class="w-full max-w-screen-xl lg:px-12">
                <div v-if="cardStore.errorMessage" class="text-red-500">
                    {{ cardStore.errorMessage }}
                </div>
                <div v-else class="relative overflow-hidden bg-white shadow-md dark:bg-gray-800 sm:rounded-lg">
                    <div
                        class="flex flex-col items-center justify-between p-4 space-y-3 md:flex-row md:space-y-0 md:space-x-4">
                        <div class="w-full md:w-1/2">
                            <SearchBar v-model="searchQuery" />
                        </div>
                        <div
                            class="flex flex-col items-stretch justify-end flex-shrink-0 w-full space-y-2 md:w-auto md:flex-row md:space-y-0 md:items-center md:space-x-3">
                            <button type="button" id="createProductModalButton" @click="openCreateModal"
                                class="btn btn-primary px-4 py-2 rounded-[3px] text-[20px] text-white font-semibold h-[49px] bg-[#2698E2] md:hover:bg-[#46a9ef]">
                                Ajouter
                            </button>
                        </div>
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
                    <div v-else class="overflow-x-auto">
                        <!-- Tableau qui liste les items -->
                        <ListCrud :cards="filteredCards" @viewCard="handleViewCard" @editCard="handleEditCard"
                            @deleteCard="handleDeleteCard" />
                    </div>
                </div>
            </div>
            <!-- End block -->
            <!-- Add modal -->
            <ModalCrud :isVisible="isCreateModalVisible" @close="closeCreateModal" />
            <!-- Update modal -->
            <UpdateCrud :isVisible="isUpdateModalVisible" :card="selectedCard" @close="closeUpdateModal"
                @save="saveUpdatedCard" />
            <!-- Read modal -->
            <ShowCrud :card="selectedCard" :isVisible="isShowModalVisible" @close="isShowModalVisible = false" />
            <!-- Delete modal -->
            <DeleteCrud :isVisible="isDeleteModalVisible" :cardId="selectedCardId" @close="isDeleteModalVisible = false"
                @confirm-delete="fetchCards" />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, computed, watch } from 'vue';
import { useCardStore } from '@/stores/cardStore';
import ModalCrud from '@/components/ModalCrud.vue';
import ListCrud from '@/components/ListCrud.vue';
import ShowCrud from '@/components/ShowCrud.vue';
import DeleteCrud from '@/components/DeleteCrud.vue';
import UpdateCrud from '@/components/UpdateCrud.vue';
import SearchBar from '@/components/SearchBar.vue';
import type { Carte } from '@/models/Carte';

export default defineComponent({
    components: {
        ModalCrud,
        ListCrud,
        ShowCrud,
        DeleteCrud,
        UpdateCrud,
        SearchBar
    },
    props: {
        themeIdd: {
            type: String,
            required: true
        }
    },
    setup(props) {
        const cardStore = useCardStore();
        const selectedCard = ref<Carte | null>(null);
        const isShowModalVisible = ref(false);
        const isDeleteModalVisible = ref(false);
        const isUpdateModalVisible = ref(false);
        const isCreateModalVisible = ref(false);
        const selectedCardId = ref<number | null>(null);
        const searchQuery = ref('');
        const isLoading = ref(true);

        const handleViewCard = (card: Carte) => {
            selectedCard.value = card;
            isShowModalVisible.value = true;
        };

        const handleEditCard = (card: Carte) => {
            selectedCard.value = card;
            isUpdateModalVisible.value = true;
        };

        const handleDeleteCard = (cardId: number) => {
            selectedCardId.value = cardId;
            isDeleteModalVisible.value = true;
        };

        const openCreateModal = () => {
            isCreateModalVisible.value = true;
        };

        const closeCreateModal = () => {
            isCreateModalVisible.value = false;
        };

        const closeUpdateModal = () => {
            isUpdateModalVisible.value = false;
        };

        const saveUpdatedCard = (updatedCard: { id: number, question: string, answer: string }) => {
            console.log('Updated card:', updatedCard);
            const index = cardStore.cards.findIndex(card => card.id === updatedCard.id);
            if (index !== -1) {
                cardStore.cards[index].question = updatedCard.question;
                cardStore.cards[index].reponse = updatedCard.answer;
            }
            isUpdateModalVisible.value = false;
        };

        // Calculer les cartes filtrées en fonction de la recherche
        const filteredCards = computed(() => {
            return cardStore.cards.filter(card =>
                card.question.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                card.reponse.toLowerCase().includes(searchQuery.value.toLowerCase())
            );
        });

        // Récupérer les cartes en fonction de l'ID du thème
        const fetchCards = async () => {
            isLoading.value = true;
            await cardStore.fetchCardsOfUser(props.themeIdd);
            isLoading.value = false;
        };

        // Regarder les changements de themeIdd et récupérer les cartes correspondantes
        watch(() => props.themeIdd, fetchCards);

        // Récupérer les cartes lorsque le composant est monté
        fetchCards();

        return {
            selectedCard,
            isShowModalVisible,
            isDeleteModalVisible,
            isUpdateModalVisible,
            isCreateModalVisible,
            selectedCardId,
            searchQuery,
            handleViewCard,
            handleEditCard,
            handleDeleteCard,
            closeUpdateModal,
            openCreateModal,
            closeCreateModal,
            saveUpdatedCard,
            filteredCards,
            isLoading,
            cardStore,
            fetchCards
        };
    }
});
</script>

<style scoped></style>
