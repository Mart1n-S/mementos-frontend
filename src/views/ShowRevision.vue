<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useRevisionStore } from '@/stores/revisionStore';
import { useGuestStore } from '@/stores/guestStore';
import FooterComponent from '@/components/FooterComponent.vue';
import BackButton from '@/components/BackButton.vue';
import RevisionInteraction from '@/components/RevisionInteraction.vue';
import Modal from '@/components/ModalRevision.vue';
import { useAuthStore } from '@/stores/authStore';
import { useNotificationStore } from '@/stores/notificationStore';
import { useRouter } from 'vue-router';

const revisionStore = useRevisionStore();
const guestStore = useGuestStore();
const authStore = useAuthStore();
const notificationStore = useNotificationStore();

const isModalVisible = ref(true);
const numberOfCards = ref<number>(0);
const isLoading = ref(false);
const router = useRouter();

const fetchCards = async (numberOfCardsToFetch: number) => {
    if (authStore.user) {
        isLoading.value = true;
        isModalVisible.value = false;
        numberOfCards.value = numberOfCardsToFetch;
        localStorage.setItem('isModalVisible', 'false');
        localStorage.setItem('numberOfCards', numberOfCards.value.toString());

        await revisionStore.fetchCardsForToday(numberOfCards.value);
        if (notificationStore.errorMessage !== null) {
            router.push('/mon-mementos');
        }
    } else if (guestStore.isGuest) {
        numberOfCards.value = numberOfCardsToFetch;
        isModalVisible.value = false;
        await guestStore.fetchGuestCardsForToday(numberOfCards.value);
    }

    isLoading.value = false;
};
onMounted(() => {
    const storedIsModalVisible = localStorage.getItem('isModalVisible');
    const storedNumberOfCards = localStorage.getItem('numberOfCards');

    if (storedIsModalVisible === 'false' && storedNumberOfCards) {
        isModalVisible.value = false;
        numberOfCards.value = parseInt(storedNumberOfCards, 10);
        fetchCards(numberOfCards.value);
    }
});

onUnmounted(() => {
    localStorage.removeItem('isModalVisible');
    localStorage.removeItem('numberOfCards');
});
</script>

<template>
    <main>
        <section class="sm:ml-64 custom-gradient md:p-4">
            <div class="mt-14">
                <div class="flex flex-col items-center justify-center p-4 py-10 text-center text-white">
                    <BackButton />
                    <h1 class="mb-4 text-[50px] font-bold">MEMENTOS</h1>
                    <p class="mb-8 text-[22px]">Prenez votre temps pour réfléchir <span class="text-[32px]">🧙‍♂️</span>
                    </p>
                </div>
                <div class="min-h-screen py-10 bg-white rounded-t-3xl">
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
                    <div v-else class="container px-4 mx-auto text-center sm:px-6">
                        <RevisionInteraction
                            v-if="!isModalVisible && (revisionStore.cards.length > 0 || guestStore.guestCards.length > 0)" />
                        <div
                            v-if="!isModalVisible && (revisionStore.cards.length <= 0 && guestStore.guestCards.length <= 0)">
                            <p class="text-center mb-8 text-[24px] font-semibold">Révision du jour terminée. <br>🧙‍♂️
                                Bravo !</p>
                            <RouterLink to="/mon-mementos"
                                class="block mt-4 px-4 py-2 font-bold text-white text-[22px] bg-[#2698E2] md:hover:bg-[#46a9ef] rounded text-center">
                                Retourner à mon mementos
                            </RouterLink>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    </main>
    <FooterComponent />
    <Modal :isVisible="isModalVisible" @confirm="fetchCards" />
</template>
