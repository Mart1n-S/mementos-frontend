<template>
    <div class="flex flex-col items-center min-h-screen py-10 bg-white rounded-t-3xl">
        <h1 class="mb-8 text-5xl font-bold">Inscription</h1>
        <form class="w-full max-w-md px-4" @submit.prevent="register">
            <div class="mb-6">
                <label for="pseudo" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Pseudo</label>
                <input type="text" id="pseudo" name="pseudo"
                    class="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Pseudo" required v-model="pseudo">
                <p v-if="errors.pseudo" class="mt-2 text-sm text-red-600 dark:text-red-500">
                    <span class="font-medium">Oops!</span> {{ errors.pseudo }}
                </p>
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
            <div class="mb-6">
                <label for="niveauRevision" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Niveau
                    de révision</label>
                <input type="number" id="niveauRevision" name="niveauRevision"
                    class="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Niveau" required v-model="niveauRevision" step="1" min="1" max="7">
                <p v-if="errors.niveauRevision" class="mt-2 text-sm text-red-600 dark:text-red-500">
                    <span class="font-medium">Oops!</span> {{ errors.niveauRevision }}
                </p>
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
                    <p class="mt-2">Vous pouvez régler le niveau dans vos paramètres.</p>
                </div>
            </div>
            <div class="relative">
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
            <p v-if="errors.password" class="mt-2 text-sm text-red-600 dark:text-red-500">
                <span class="font-medium">Oops!</span> {{ errors.password }}
            </p>
            <div class="flex p-4 my-4 text-sm text-blue-800 rounded-lg bg-blue-50" role="alert">
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
            </div>
            <div class="flex items-center justify-center mb-6">
                <input id="terms" type="checkbox" name="terms"
                    class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                    v-model="terms">
                <label
                    :class="{ 'text-red-600': !terms && attemptedSubmit, 'text-gray-900': terms || !attemptedSubmit }"
                    for="terms" class="block ml-2 text-sm">
                    <RouterLink to="/cgu" class="underline" target="_blank">J'accepte les
                        conditions générales d'utilisation</RouterLink>
                </label>
            </div>
            <button type="submit"
                class="w-full px-4 py-2 font-bold text-white text-[22px] bg-[#2698E2] md:hover:bg-[#46a9ef] rounded focus:outline-none focus:shadow-outline">
                S'inscrire
            </button>
            <p class="mt-4 text-center">
                Vous avez déjà un compte ?
                <RouterLink to="/connexion" class="text-blue-600 hover:underline">
                    Se connecter
                </RouterLink>
            </p>
        </form>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';

interface ValidationError {
    [key: string]: string | undefined;
}

export default defineComponent({
    setup() {
        const router = useRouter();
        const pseudo = ref('');
        const email = ref('');
        const niveauRevision = ref('');
        const password = ref('');
        const confirmPassword = ref('');
        const terms = ref(false);
        const errors = ref<ValidationError>({});
        const attemptedSubmit = ref(false);
        const showPassword = ref(false);

        const authStore = useAuthStore();
        const errorMessage = ref<string | null>(null);

        const togglePasswordVisibility = () => {
            showPassword.value = !showPassword.value;
        };

        const register = async () => {
            attemptedSubmit.value = true;
            errors.value = {};

            await authStore.register(pseudo.value, email.value, niveauRevision.value, password.value, confirmPassword.value, terms.value);

            // Récupérer les messages d'erreur du store
            if (authStore.errorMessage) {
                errorMessage.value = authStore.errorMessage;
            }

            // Récupérer les erreurs de validation spécifiques
            if (authStore.validationErrors) {
                const validationErrors = authStore.validationErrors;
                for (const key in validationErrors) {
                    if (Object.prototype.hasOwnProperty.call(validationErrors, key)) {
                        errors.value[key] = validationErrors[key];
                    }
                }
            }
        };

        return {
            pseudo,
            email,
            niveauRevision,
            password,
            confirmPassword,
            terms,
            errors,
            attemptedSubmit,
            showPassword,
            togglePasswordVisibility,
            register,
            errorMessage,
            router
        };
    }
});
</script>


<style></style>
