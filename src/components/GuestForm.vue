<template>
    <div class="flex flex-col items-center min-h-screen py-10 bg-white rounded-t-3xl">
        <h1 class="mb-8 text-5xl font-bold">Invité</h1>
        <form class="w-full max-w-md px-4" @submit.prevent="submitFormGuest">
            <div class="mb-6">
                <label for="pseudo" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Pseudo</label>
                <input type="text" id="pseudo" name="pseudo" v-model="pseudo"
                    class="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Pseudo" required minlength="2" maxlength="20">
                <p v-if="errors.pseudo" class="mt-2 text-sm text-red-600 dark:text-red-500">
                    <span class="font-medium">Oops!</span> {{ errors.pseudo }}
                </p>
            </div>
            <div class="mb-6">
                <label for="niveauRevision" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Niveau
                    de révision</label>
                <input type="number" id="niveauRevision" name="niveauRevision" v-model="niveauRevision"
                    class="block w-full p-4 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Niveau" required step="1" min="1" max="7">
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
            <div class="flex p-4 mb-4 text-sm text-blue-800 bg-red-100 rounded-lg dark:bg-gray-800 dark:text-blue-400"
                role="alert">
                <svg class="flex-shrink-0 inline w-4 h-4 me-3 mt-[2px]" aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path
                        d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                </svg>
                <span class="sr-only">Attention</span>
                <div>
                    <span class="font-medium">Informations sur les comptes invités.</span>
                    <ul class="mt-1.5 list-disc list-inside">
                        <li>Si vous videz votre cache, toutes vos révisions seront perdues. Pour les conserver, veuillez
                            plutôt vous inscrire.</li>
                    </ul>
                </div>
            </div>


            <button type="submit"
                class="w-full px-4 py-2 font-bold text-white text-[22px] bg-[#2698E2] md:hover:bg-[#46a9ef] rounded focus:outline-none focus:shadow-outline">
                Valider
            </button>
        </form>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useGuestStore } from '@/stores/guestStore';
import { useRouter } from 'vue-router';

export default defineComponent({
    setup() {
        const pseudo = ref('');
        const niveauRevision = ref<number | null>(null);
        const errors = ref<{ pseudo?: string; niveauRevision?: string }>({});

        const guestStore = useGuestStore();
        const router = useRouter();

        const validateForm = () => {
            errors.value = {};

            if (!pseudo.value) {
                errors.value.pseudo = 'Le pseudo est requis';
            } else if (pseudo.value.length < 2 || pseudo.value.length > 20) {
                errors.value.pseudo = 'Le pseudo doit contenir entre 2 et 20 caractères';
            }

            if (!niveauRevision.value || niveauRevision.value < 1 || niveauRevision.value > 7) {
                errors.value.niveauRevision = 'Le niveau de révision doit être entre 1 et 7';
            }

            return Object.keys(errors.value).length === 0;
        };

        const submitFormGuest = async () => {
            if (validateForm()) {
                await guestStore.setGuestData({
                    pseudo: pseudo.value,
                    niveauRevision: niveauRevision.value!,
                });
                router.push('/profil');
            }
        };

        return {
            pseudo,
            niveauRevision,
            errors,
            submitFormGuest,
        };
    },
});
</script>


<style></style>
