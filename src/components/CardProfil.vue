<template>
    <div class="min-h-screen py-10 bg-white rounded-t-3xl">
        <div class="container flex flex-col items-center justify-center p-4 py-10 text-center">
            <div class="mb-6 text-center">
                <p class="text-xl font-semibold text-gray-700 dark:text-gray-300">
                    <strong>Pseudo :</strong> {{ userPseudo }}
                </p>
                <p v-if="isAuthenticated" class="my-3 text-xl font-semibold text-gray-700 dark:text-gray-300">
                    <strong>Email :</strong> {{ authStore.user?.email }}
                </p>
                <p class="text-xl font-semibold text-gray-700 dark:text-gray-300">
                    <strong>Niveau de révision :</strong> {{ userNiveauRevision }}
                </p>
            </div>

            <div class="flex flex-col w-full mt-8 space-y-4 md:w-4/12">
                <RouterLink to="/profil/update"
                    class="btn btn-primary px-4 py-2 rounded-[3px] text-[20px] text-white font-semibold h-[49px] bg-[#2698E2] md:hover:bg-[#46a9ef]">
                    Modifier
                </RouterLink>
                <RouterLink to="/mon-mementos"
                    class="btn btn-secondary px-4 py-2 rounded-[3px] text-[20px] text-white font-semibold h-[49px] bg-[#FF4F79] md:hover:bg-[#ff3c87]">
                    Réviser
                </RouterLink>
                <RouterLink to="/creer-themes"
                    class="btn btn-secondary px-4 py-2 rounded-[3px] text-[20px] text-white font-semibold h-[49px] bg-[#FFA34F] md:hover:bg-[#f8b270]">
                    Créer un mementos
                </RouterLink>
                <button v-if="!isAuthenticated" @click="deleteGuestAccount"
                    class="btn btn-secondary px-4 py-2 rounded-[3px] text-[20px] text-white font-semibold h-[49px] bg-[#ff4f4f] md:hover:bg-[#f87070]">
                    Supprimer mon compte invité
                </button>
            </div>

        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useGuestStore } from '@/stores/guestStore';
import { useRouter } from 'vue-router';

export default defineComponent({
    setup() {
        const authStore = useAuthStore();
        const guestStore = useGuestStore();
        const router = useRouter();

        const isAuthenticated = computed(() => authStore.isAuthenticated);

        const userPseudo = computed(() => {
            return isAuthenticated.value ? authStore.user?.pseudo : guestStore.guestData?.pseudo;
        });

        const userNiveauRevision = computed(() => {
            return isAuthenticated.value ? authStore.user?.niveauRevision : guestStore.guestData?.niveauRevision;
        });

        const deleteGuestAccount = async () => {
            await guestStore.deleteAllData();
            router.push('/');
        };

        return { authStore, isAuthenticated, userPseudo, userNiveauRevision, deleteGuestAccount };
    }
});
</script>

<style scoped></style>
