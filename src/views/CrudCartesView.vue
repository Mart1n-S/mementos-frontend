<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/authStore';
import { useThemeStore } from '@/stores/themeStore';
import { useRevisionStore } from '@/stores/revisionStore';
import { useGuestStore } from '@/stores/guestStore';
import CrudCartes from '@/components/CrudCartes.vue';
import BackButton from '@/components/BackButton.vue';
import FooterComponent from '@/components/FooterComponent.vue';

const route = useRoute();
const themeId = Array.isArray(route.params.themeId) ? route.params.themeId[0] : route.params.themeId;

const authStore = useAuthStore();
const themeStore = useThemeStore();
const revisionStore = useRevisionStore();
const guestStore = useGuestStore();
const themeName = ref('');
const themeState = ref('');

onMounted(async () => {
    let theme;
    if (authStore.isAuthenticated) {
        theme = themeStore.themes.find(t => t.id === parseInt(themeId));
        if (authStore.user) {
            await revisionStore.fetchUserRevision(authStore.user.id);
        }
    } else if (guestStore.isGuest) {
        guestStore.loadRevisions(parseInt(themeId));
        theme = guestStore.themes.find(t => t.id === parseInt(themeId));
    }

    if (theme) {
        themeName.value = theme.nom;
        if (authStore.isAuthenticated) {
            themeState.value = theme.public == true ? 'Public' : 'Privé';
        }
    } else {
        if (authStore.isAuthenticated) {
            await themeStore.fetchThemeById(themeId);
            if (themeStore.theme) {
                themeName.value = themeStore.theme.nom;
                themeState.value = themeStore.theme.public == true ? 'Public' : 'Privé';
            }
        } else if (guestStore.isGuest) {
            await guestStore.loadThemes();
            theme = guestStore.themes.find(t => t.id === parseInt(themeId));
            if (theme) {
                themeName.value = theme.nom;
            }
        }
    }
});

const handleRevise = async (id: number) => {
    if (authStore.isAuthenticated) {
        await revisionStore.addToMyRevision(id);
    } else if (guestStore.isGuest) {
        await guestStore.addGuestRevision(id);
    }
};

const isAlreadyRevised = computed(() => {
    if (authStore.isAuthenticated) {
        return revisionStore.themesRevision.some(theme => theme.id === parseInt(themeId));
    } else if (guestStore.isGuest) {
        return guestStore.revisions.some(revision => revision.theme_id === parseInt(themeId));
    }
    return false;
});
</script>


<template>
    <main>
        <section class="sm:ml-64 custom-gradient md:p-4">
            <div class="mt-14">
                <div class="flex flex-col items-center justify-center p-4 py-10 text-center text-white">
                    <BackButton />
                    <h1 class="mb-4 text-[50px] font-bold">{{ themeName }}</h1>
                    <p v-if="!guestStore.isGuest" class="mb-8 font-semibold text-[22px]">Etat : {{ themeState }}</p>
                    <div v-if="themeName != ''" class="flex flex-col w-full my-8 space-y-4 md:w-4/12">
                        <button v-if="!isAlreadyRevised" @click="handleRevise(parseInt(themeId))"
                            class="btn btn-primary px-4 py-2 rounded-[3px] text-[20px] text-white font-semibold h-[49px] bg-[#2698E2] md:hover:bg-[#46a9ef]">
                            Réviser
                        </button>
                        <RouterLink :to="`/mes-themes/gestion/update/${themeId}`"
                            class="btn btn-secondary px-4 py-2 rounded-[3px] text-[20px] text-white font-semibold h-[49px] bg-[#FF4F79] md:hover:bg-[#ff3c87]">
                            Modifier
                        </RouterLink>
                    </div>

                </div>
                <CrudCartes :themeIdd="themeId" />
            </div>
        </section>
    </main>
    <FooterComponent />
</template>

<style></style>