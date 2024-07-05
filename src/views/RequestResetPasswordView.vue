<script setup lang="ts">
import { useRouter } from 'vue-router';
import RequestResetPassword from '@/components/RequestResetPassword.vue';
import FooterComponent from '@/components/FooterComponent.vue';

// Utilisation du router pour la navigation
const router = useRouter();

// Fonction de retour
const goBack = () => {
    router.back();
};
</script>

<template>
    <main>
        <section class="sm:ml-64 custom-gradient md:p-4">
            <div class="mt-14">
                <div class="flex flex-col items-center justify-center p-4 py-10 text-center text-white">
                    <!-- Bouton de retour -->
                    <div class="w-full mb-4 text-left">
                        <button @click="goBack" class="text-white hover:text-gray-300">
                            <svg width="35" height="35" fill="none" stroke="#ffffff" stroke-linecap="round"
                                stroke-linejoin="round" stroke-width="3" viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M2.9 12h18"></path>
                                <path d="m8.9 18-6-6 6-6"></path>
                            </svg>
                        </button>
                    </div>
                </div>
                <RequestResetPassword />
            </div>
        </section>
    </main>
    <FooterComponent />
</template>

<style></style>