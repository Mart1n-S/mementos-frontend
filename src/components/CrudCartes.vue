<template>
    <div class="min-h-screen py-10 bg-white rounded-t-3xl">
        <div class="container flex flex-col items-center justify-center text-center">
            <!-- Start block -->
            <div class="w-full max-w-screen-xl lg:px-12">
                <div class="relative overflow-hidden bg-white shadow-md dark:bg-gray-800 sm:rounded-lg">
                    <div
                        class="flex flex-col items-center justify-between p-4 space-y-3 md:flex-row md:space-y-0 md:space-x-4">
                        <div class="w-full md:w-1/2">
                            <SearchBar v-model="searchQuery" />
                        </div>
                        <div
                            class="flex flex-col items-stretch justify-end flex-shrink-0 w-full space-y-2 md:w-auto md:flex-row md:space-y-0 md:items-center md:space-x-3">
                            <button type="button" id="createProductModalButton" data-modal-target="createProductModal"
                                data-modal-toggle="createProductModal"
                                class="btn btn-primary px-4 py-2 rounded-[3px] text-[20px] text-white font-semibold h-[49px] bg-[#2698E2] md:hover:bg-[#46a9ef]">
                                Ajouter
                            </button>
                        </div>
                    </div>
                    <div class="overflow-x-auto">
                        <!-- Tableau qui liste les items -->
                        <!-- <ListCrud :cards="cards" @viewCard="handleViewCard" @editCard="handleEditCard"
                            @deleteCard="handleDeleteCard" /> -->
                        <ListCrud :cards="filteredCards" @viewCard="handleViewCard" @editCard="handleEditCard"
                            @deleteCard="handleDeleteCard" />
                    </div>
                </div>
            </div>
            <!-- End block -->
            <!-- Add modal -->
            <ModalCrud />
            <!-- Update modal -->
            <UpdateCrud :isVisible="isUpdateModalVisible" :card="selectedCard" @close="closeUpdateModal"
                @save="saveUpdatedCard" />
            <!-- Read modal -->
            <ShowCrud :card="selectedCard" :isVisible="isShowModalVisible" @close="isShowModalVisible = false" />
            <!-- Delete modal -->
            <DeleteCrud :isVisible="isDeleteModalVisible" :cardId="selectedCardId" @close="isDeleteModalVisible = false"
                @confirmDelete="confirmDeleteCard" />
        </div>
    </div>

</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
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
    setup() {
        const cards = ref<Carte[]>([]);
        const selectedCard = ref<Carte | null>(null);
        const isShowModalVisible = ref(false);
        const isDeleteModalVisible = ref(false);
        const isUpdateModalVisible = ref(false);
        const selectedCardId = ref<number | null>(null);
        const searchQuery = ref('');

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

        const closeUpdateModal = () => {
            isUpdateModalVisible.value = false;
        };

        const confirmDeleteCard = (cardId: number) => {
            console.log(`Deleting card with ID: ${cardId}`);
            isDeleteModalVisible.value = false;
            cards.value = cards.value.filter(card => card.id !== cardId);
        };

        const saveUpdatedCard = (updatedCard: { id: number, question: string, answer: string }) => {
            console.log('Updated card:', updatedCard);
            const index = cards.value.findIndex(card => card.id === updatedCard.id);
            if (index !== -1) {
                cards.value[index].question = updatedCard.question;
                cards.value[index].reponse = updatedCard.answer;
            }
            isUpdateModalVisible.value = false;
        };

        // Calculer les cartes filtrées en fonction de la recherche
        const filteredCards = computed(() => {
            return cards.value.filter(card =>
                card.question.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
                card.reponse.toLowerCase().includes(searchQuery.value.toLowerCase())
            );
        });

        // Simulate fetching cards from an API or other data source
        onMounted(() => {
            cards.value = [
                {
                    id: 1,
                    question: 'Quelle invention a révolutionné l\'Europe pendant la Renaissance ?',
                    reponse: 'L\'imprimerie',
                    theme: {
                        id: 1,
                        nom: 'La Renaissance',
                        couleur: '#A88DFF',
                        category_id: 1,
                        user_id: 3,
                        public: true,
                        user: {
                            id: 3,
                            pseudo: 'pkunde',
                            email: 'volkman.arno@example.com',
                            niveauRevision: 6
                        }
                    }
                },
                {
                    id: 2,
                    question: 'Quel artiste est célèbre pour ses peintures de la chapelle Sixtine ?',
                    reponse: 'Michel-Ange',
                    theme: {
                        id: 1,
                        nom: 'La Renaissance',
                        couleur: '#A88DFF',
                        category_id: 1,
                        user_id: 3,
                        public: true,
                        user: {
                            id: 3,
                            pseudo: 'pkunde',
                            email: 'volkman.arno@example.com',
                            niveauRevision: 6
                        }
                    }
                }
            ];
        });

        return {
            cards,
            selectedCard,
            isShowModalVisible,
            isDeleteModalVisible,
            isUpdateModalVisible,
            selectedCardId,
            searchQuery,
            handleViewCard,
            handleEditCard,
            handleDeleteCard,
            closeUpdateModal,
            confirmDeleteCard,
            saveUpdatedCard,
            filteredCards
        };
    }
});
</script>

<style scoped></style>
