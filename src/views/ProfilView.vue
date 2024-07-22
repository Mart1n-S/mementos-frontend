<script setup lang="ts">
import { onMounted } from 'vue';
import CardProfil from '@/components/CardProfil.vue';
import FooterComponent from '@/components/FooterComponent.vue';
import BackButton from '@/components/BackButton.vue';
import { askPermission, subscribeUserToPush, sendSubscriptionToBackEnd, subscribeGuestToPush } from '@/services/pushService';
import { useAuthStore } from '@/stores/authStore';
import { useGuestStore } from '@/stores/guestStore';

const authStore = useAuthStore();
const guestStore = useGuestStore();

const checkSubscriptionStatus = async () => {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
        const subscription = await registration.pushManager.getSubscription();
        if (!subscription) {
            if (authStore.user) {
                await authStore.updateSubscriptionStatus(false);
            } else if (guestStore.isGuest) {
                localStorage.removeItem('guest_push_subscription');
            }
        }
    }
};

onMounted(async () => {
    await checkSubscriptionStatus();
    if (authStore.isAuthenticated && authStore.user) {
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
    } else if (guestStore.isGuest) {
        if (!localStorage.getItem('guest_push_subscription')) {
            try {
                const permission = await askPermission();
                if (permission === 'granted') {
                    await subscribeGuestToPush();
                    console.log('Notifications push pour les invités configurées avec succès.');
                }
            } catch (error) {
                console.error('Erreur lors de la configuration des notifications push pour les invités:', error);
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