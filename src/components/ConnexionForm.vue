<template>
    <div class="flex flex-col items-center min-h-screen py-10 bg-white rounded-t-3xl">
        <h1 class="mb-8 text-5xl font-bold">Connexion</h1>
        <form class="w-full max-w-md px-4" @submit.prevent="login">
            <p v-if="successMessage" class="mt-2 mb-4 text-lg text-center text-green-600">
                <span class="font-medium">Succès!</span> {{ successMessage }}
            </p>
            <p v-if="authStore.errorMessage" class="mt-2 mb-4 text-lg text-center text-red-600 dark:text-red-500">
                <span class="font-medium">Oops!</span> {{ authStore.errorMessage }}
            </p>
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
                <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                <input type="email" id="email" name="email"
                    class="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Email" required v-model="email">
            </div>
            <div class="relative mb-6">
                <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Mot de
                    passe</label>
                <input :type="showPassword ? 'text' : 'password'" id="password" name="password"
                    class="block w-full p-4 pr-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Mot de passe" required v-model="password">
                <svg @click="togglePasswordVisibility" class="absolute cursor-pointer top-10 right-3" width="25"
                    height="25" fill="none" stroke="#737373" stroke-linecap="round" stroke-linejoin="round"
                    stroke-width="1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 5.25C4.5 5.25 1.5 12 1.5 12s3 6.75 10.5 6.75S22.5 12 22.5 12s-3-6.75-10.5-6.75Z">
                    </path>
                    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"></path>
                </svg>
            </div>
            <button type="submit"
                class="w-full px-4 py-2 font-bold text-white text-[22px] bg-[#2698E2] md:hover:bg-[#46a9ef] rounded focus:outline-none focus:shadow-outline">
                Se connecter
            </button>
            <p class="mt-4 text-center">
                <RouterLink to="/reset-password" class="underline">
                    Mot de passe oublié ?
                </RouterLink>
            </p>
        </form>
        <div class="w-full max-w-md px-4">
            <p class="text-center my-9">OU</p>
            <div class="flex flex-col w-full gap-8 space-y-4">
                <RouterLink to="/inscription"
                    class="text-center btn btn-primary px-4 py-2 rounded-[3px] text-[20px] text-white font-semibold h-[49px] bg-[#2698E2] md:hover:bg-[#46a9ef]">
                    S'inscrire
                </RouterLink>
                <RouterLink to="/invite"
                    class="text-center btn btn-secondary px-4 py-2 rounded-[3px] text-[20px] text-white font-semibold h-[49px] bg-[#FF4F79] md:hover:bg-[#ff3c87]">
                    Invité
                </RouterLink>
            </div>
        </div>

    </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
import { defineComponent } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useRoute } from 'vue-router';

export default defineComponent({
    setup() {
        const email = ref('');
        const password = ref('');
        const showPassword = ref(false);
        const authStore = useAuthStore();
        const route = useRoute();
        const successMessage = ref('');
        const isLoading = ref(false);

        const togglePasswordVisibility = () => {
            showPassword.value = !showPassword.value;
        };

        const login = async () => {
            isLoading.value = true;
            await authStore.login(email.value, password.value);
            isLoading.value = false;
        };

        onMounted(() => {
            if (route.query.reset === 'success') {
                successMessage.value = 'Votre mot de passe a été réinitialisé avec succès. Vous pouvez maintenant vous connecter.';
            }
            authStore.clearError();
        });

        return {
            email,
            password,
            showPassword,
            authStore,
            togglePasswordVisibility,
            login,
            successMessage,
            isLoading
        };
    }
});
</script>

<style></style>
