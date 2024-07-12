<template>
    <div class="min-h-screen py-10 bg-white rounded-t-3xl">
        <div class="container flex flex-col items-center justify-center p-4 py-10 text-center">
            <div class="mb-6 text-center">
                <p class="text-xl font-semibold text-gray-700 dark:text-gray-300"><strong>Pseudo :</strong> {{
                    authStore.user?.pseudo }}</p>
                <p class="my-3 text-xl font-semibold text-gray-700 dark:text-gray-300"><strong>Email :</strong> {{
                    authStore.user?.email }}</p>
                <p class="text-xl font-semibold text-gray-700 dark:text-gray-300"><strong>Niveau de révision
                        :</strong> {{
                            authStore.user?.niveauRevision }}</p>
            </div>

            <div class="flex flex-col w-full mt-8 space-y-4 md:w-4/12">
                <RouterLink to="/profil/update"
                    class="btn btn-primary px-4 py-2 rounded-[3px] text-[20px] text-white font-semibold h-[49px] bg-[#2698E2] md:hover:bg-[#46a9ef]">
                    Modifier
                </RouterLink>
                <RouterLink to="/profil/update"
                    class="btn btn-secondary px-4 py-2 rounded-[3px] text-[20px] text-white font-semibold h-[49px] bg-[#FF4F79] md:hover:bg-[#ff3c87]">
                    Réviser
                </RouterLink>
                <RouterLink to="/creer-themes"
                    class="btn btn-secondary px-4 py-2 rounded-[3px] text-[20px] text-white font-semibold h-[49px] bg-[#FFA34F] md:hover:bg-[#f8b270]">
                    Créer un mementos
                </RouterLink>
            </div>

        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useAuthStore } from '@/stores/authStore';

export default defineComponent({
    setup() {
        const authStore = useAuthStore();
        return { authStore };
    }
});
</script>

<style scoped></style>
