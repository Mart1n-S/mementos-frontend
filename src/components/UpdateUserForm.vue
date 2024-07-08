<template>
    <div class="flex flex-col items-center min-h-screen py-10 bg-white rounded-t-3xl">
        <h1 class="mb-8 text-5xl font-bold">Modifier le Profil</h1>
        <form class="w-full max-w-md px-4" @submit.prevent="updateUser">
            <div v-if="authStore.successMessage" class="mb-6 text-center text-green-600">
                {{ authStore.successMessage }}
            </div>
            <div v-if="authStore.errorMessage" class="mb-6 text-center text-red-600">
                {{ authStore.errorMessage }}
            </div>
            <div v-else-if="authStore.validationErrors"
                class="mt-2 mb-4 text-lg text-center text-red-600 dark:text-red-500">
                <ul>
                    <li v-for="(error, key) in authStore.validationErrors" :key="key">
                        <span class="font-medium">{{ error[0] }}</span>
                    </li>
                </ul>
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
            <div class="mb-6">
                <label for="pseudo" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Pseudo</label>
                <input v-model="form.pseudo" type="text" name="pseudo" id="pseudo" minlength="2" maxlength="20"
                    class="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div class="mb-6">
                <label for="niveauRevision" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Niveau
                    de révision</label>
                <input v-model="form.niveauRevision" type="number" name="niveauRevision" id="niveauRevision" step="1"
                    min="1" max="7"
                    class="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500" />
            </div>
            <div class="flex p-4 mb-4 text-sm text-blue-800 bg-yellow-100 rounded-lg dark:bg-gray-800 dark:text-blue-400"
                role="alert">
                <svg class="flex-shrink-0 inline w-4 h-4 me-3 mt-[2px]" aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path
                        d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                </svg>
                <span class="sr-only">Info</span>
                <div>
                    <span class="font-medium">Informations sur les niveaux de révision</span>
                    <ul class="mt-1.5 list-disc list-inside">
                        <li><strong>Niveau 1 :</strong> Révision quotidienne. Chaque carte à ce niveau doit être révisée
                            tous les jours pour renforcer la mémorisation.</li>
                        <li><strong>Niveau 2 :</strong> Révision tous les 2 jours. Une fois qu'une carte est
                            correctement rappelée au niveau 1, elle passe au niveau 2 et doit être révisée tous les deux
                            jours.</li>
                        <li><strong>Niveaux ultérieurs :</strong> Chaque niveau suit la formule 2^(N-1) jours.</li>
                    </ul>
                </div>
            </div>
            <div class="space-y-8">
                <button type="submit"
                    class="w-full px-4 py-2 font-bold text-white text-[22px] bg-[#2698E2] md:hover:bg-[#46a9ef] rounded focus:outline-none focus:shadow-outline">
                    Mettre à jour
                </button>
                <button type="button" @click="$router.back()"
                    class="w-full px-4 py-2 font-bold text-white text-[22px] bg-[#FF4F79] md:hover:bg-[#ff3c87] rounded focus:outline-none focus:shadow-outline">
                    Annuler
                </button>
            </div>

        </form>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import axios from '@/modules/axios';

export default defineComponent({
    setup() {
        const isLoading = ref(false);
        const authStore = useAuthStore();
        const form = ref({
            pseudo: '',
            niveauRevision: 1
        });

        onMounted(() => {
            if (authStore.user) {
                form.value.pseudo = authStore.user.pseudo;
                form.value.niveauRevision = authStore.user.niveauRevision;
                authStore.clearError();
                authStore.successMessage = null;
            }
        });

        const updateUser = async () => {
            try {
                const token = localStorage.getItem('access_token');
                if (!token) {
                    authStore.errorMessage = "Vous devez être connecté pour effectuer cette action.";
                    return;
                }

                const userId = authStore.user?.id;
                isLoading.value = true;
                const response = await axios.put(
                    `/user/${userId}`,
                    {
                        pseudo: form.value.pseudo,
                        niveauRevision: form.value.niveauRevision,
                    },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (response.status === 200) {
                    // Mettre à jour les informations de l'utilisateur dans le store
                    await authStore.fetchUser();
                    isLoading.value = false;
                    authStore.successMessage = "Informations mises à jour avec succès.";
                }
            } catch (error: any) {
                isLoading.value = false;
                if (error.response.status === 422) {
                    authStore.validationErrors = error.response.data.errors;
                } else {
                    authStore.errorMessage = error.response.data.message || "Une erreur s'est produite lors de la mise à jour.";
                }
            }
        };


        return { form, updateUser, authStore, isLoading };
    }
});
</script>
