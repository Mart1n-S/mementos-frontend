<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useThemeStore } from '@/stores/themeStore';
import CrudCartes from '@/components/CrudCartes.vue';
import BackButton from '@/components/BackButton.vue';
import FooterComponent from '@/components/FooterComponent.vue';

const route = useRoute();
const themeId = Array.isArray(route.params.themeId) ? route.params.themeId[0] : route.params.themeId;

const themeStore = useThemeStore();
const themeName = ref('');
const themeSate = ref('');

onMounted(async () => {
    const theme = themeStore.themes.find(t => t.id === parseInt(themeId));
    if (theme) {
        themeName.value = theme.nom;
    } else {
        // Si le user tape lui-même l'URL, on doit récupérer le thème car pas récupéré par le store précédemment
        await themeStore.fetchThemeById(themeId);
        if (themeStore.theme) {
            themeName.value = themeStore.theme.nom;
            themeSate.value = themeStore.theme.public == true ? 'Public' : 'Privé';
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
                    <h1 class="mb-4 text-[50px] font-bold">{{ themeName }}</h1>
                    <p class="mb-8 font-semibold text-[22px]">Etat : {{ themeSate }}</p>
                    <div v-if="themeName != ''" class="flex flex-col w-full my-8 space-y-4 md:w-4/12">
                        <button
                            class="btn btn-primary px-4 py-2 rounded-[3px] text-[20px] text-white font-semibold h-[49px] bg-[#2698E2] md:hover:bg-[#46a9ef]">
                            Réviser
                        </button>
                        <button
                            class="btn btn-secondary px-4 py-2 rounded-[3px] text-[20px] text-white font-semibold h-[49px] bg-[#FF4F79] md:hover:bg-[#ff3c87]">
                            Modifier
                        </button>
                    </div>

                </div>
                <CrudCartes :themeIdd="themeId" />
            </div>
        </section>
    </main>
    <FooterComponent />
</template>

<style></style>