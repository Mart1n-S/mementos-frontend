<template>
    <div class="flex flex-col items-center min-h-screen py-10 bg-white rounded-t-3xl">
        <h1 class="mb-8 text-5xl font-bold text-center">Réinitialisation du mot de passe</h1>
        <form class="w-full max-w-md px-4" @submit.prevent="reset">
            <div v-if="authStore.errorMessage" class="mb-6 text-center text-red-600">
                {{ authStore.errorMessage }}
            </div>
            <div class="mb-6">
                <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
                <input type="email" id="email" name="email"
                    class="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Email" required v-model="email">
                <p v-if="errors.email" class="mt-2 text-sm text-red-600 dark:text-red-500">
                    <span class="font-medium">Oops!</span> {{ errors.email }}
                </p>
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
            <div class="flex p-4 mb-4 text-sm text-blue-800 rounded-lg bg-blue-50" role="alert">
                <svg class="flex-shrink-0 inline w-4 h-4 me-3 mt-[2px]" aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path
                        d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                </svg>
                <span class="sr-only">Info</span>
                <div>
                    <span class="font-medium">Votre mot de passe doit contenir au minimum :</span>
                    <ul class="mt-1.5 ">
                        <li>✔️ Minimum 8 caractères</li>
                        <li>✔️ Au moins une lettre majuscule</li>
                        <li>✔️ Au moins une lettre minuscule</li>
                        <li>✔️ Au moins un chiffre</li>
                        <li>✔️ Au moins un caractère spécial (@$!%*#?&)</li>
                    </ul>
                </div>
            </div>
            <div class="relative mb-6">
                <input :type="showPassword ? 'text' : 'password'" id="confirm_password" name="confirm_password"
                    class="block w-full p-4 pr-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Confirmation du mot de passe" required v-model="confirmPassword">
                <p v-if="errors.password" class="mt-2 text-sm text-red-600 dark:text-red-500">
                    <span class="font-medium">Oops!</span> {{ errors.password }}
                </p>
            </div>
            <button type="submit"
                class="w-full px-4 py-2 font-bold text-white text-[22px] bg-[#2698E2] md:hover:bg-[#46a9ef] rounded focus:outline-none focus:shadow-outline">
                Envoyer
            </button>
        </form>
    </div>
</template>

<script lang="ts">
import { ref, reactive } from 'vue';
import { defineComponent, onMounted, onBeforeUnmount } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

export default defineComponent({
    setup() {
        const route = useRoute();
        const authStore = useAuthStore();
        const email = ref('');
        const password = ref('');
        const confirmPassword = ref('');
        const showPassword = ref(false);
        const errors = reactive<{ email: string | null; password: string | null }>({ email: null, password: null });

        const togglePasswordVisibility = () => {
            showPassword.value = !showPassword.value;
        };

        const reset = async () => {
            if (password.value !== confirmPassword.value) {
                errors.password = 'Les mots de passe ne correspondent pas';
                return;
            } else {
                errors.password = null;
            }

            await authStore.resetPassword(route.query.token as string, email.value, password.value, confirmPassword.value);
        };

        onMounted(() => {
            authStore.clearError();
            authStore.clearSuccess();
        });

        onBeforeUnmount(() => {
            authStore.clearError();
            authStore.clearSuccess();
        });

        return {
            email,
            password,
            confirmPassword,
            showPassword,
            authStore,
            togglePasswordVisibility,
            reset,
            errors
        };
    }
});
</script>

<style scoped></style>
