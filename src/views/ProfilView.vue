<script setup lang="ts">
import { onMounted } from 'vue';
import CardProfil from '@/components/CardProfil.vue';
import FooterComponent from '@/components/FooterComponent.vue';
import BackButton from '@/components/BackButton.vue';
import { askPermission, subscribeUserToPush, sendSubscriptionToBackEnd } from '@/services/pushService';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();

const checkSubscriptionStatus = async () => {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
        const subscription = await registration.pushManager.getSubscription();
        if (!subscription && authStore.user) {
            await authStore.updateSubscriptionStatus(false);
        }
    }
};

onMounted(async () => {
    if (authStore.isAuthenticated && authStore.user) {
        await checkSubscriptionStatus();
        if (!authStore.user.subscribedNotifications) {
            try {
                const permission = await askPermission();
                if (permission === 'granted') {
                    const subscription = await subscribeUserToPush();
                    await sendSubscriptionToBackEnd(subscription);
                    await authStore.updateSubscriptionStatus(true);
                    console.log('Notifications push configurées avec succès.');
                }
            } catch (error) {
                console.error('Erreur lors de la configuration des notifications push:', error);
            }
        }
    }
});
</script>

<template>
    <main>
        <section class="sm:ml-64 custom-gradient md:p-4">
            <div class="mt-14">
                <div class="flex flex-col items-center justify-center p-4 py-10 text-center text-white">
                    <BackButton />
                    <h1 class="mb-4 text-[50px] font-bold">PROFIL</h1>
                </div>

                <CardProfil />
            </div>
        </section>
    </main>
    <FooterComponent />
</template>

<style></style>