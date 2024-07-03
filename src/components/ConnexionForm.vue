<template>
    <div class="flex flex-col items-center min-h-screen py-10 bg-white rounded-t-3xl">
        <h1 class="mb-8 text-5xl font-bold">Connexion</h1>
        <form class="w-full max-w-md px-4" @submit.prevent="login">
            <p v-if="authStore.errorMessage" class="mt-2 mb-4 text-lg text-center text-red-600 dark:text-red-500">
                <span class="font-medium">Oops!</span> {{ authStore.errorMessage }}
            </p>
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
                <a href="#" class="underline">Mot de passe oublié ?</a>
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

export default defineComponent({
    setup() {
        const email = ref('');
        const password = ref('');
        const showPassword = ref(false);
        const authStore = useAuthStore();

        const togglePasswordVisibility = () => {
            showPassword.value = !showPassword.value;
        };

        const login = async () => {
            await authStore.login(email.value, password.value);
        };

        onMounted(() => {
            authStore.clearError();
        });

        return {
            email,
            password,
            showPassword,
            authStore,
            togglePasswordVisibility,
            login
        };
    }
});
</script>

<style></style>
