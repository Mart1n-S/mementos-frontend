<template>
    <section class="py-10 bg-white features-section rounded-t-3xl">
        <div class="container px-4 mx-auto text-center sm:px-6">
            <h1 class="mb-6 text-[28px] font-bold">Se souvenir de tout pour (quasiment) toujours</h1>
            <p class="mb-6 text-[18px]">La répétition espacée est une technique d'apprentissage efficace...</p>
            <h2 class="mb-4 text-[28px] font-bold">Et Mementos ?</h2>
            <p class="mb-6 text-[18px]">Crée tes propres cartes de révision et organise-les par thèmes...</p>
            <hr class="mb-6 border-gray-300" />
            <h2 class="mb-4 text-[28px] font-bold">Catégories</h2>
            <p class="mb-6 text-[18px]">Retrouve une multitude de catégories de révision...</p>

            <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
                <CategorieItem v-for="(category, index) in categories.slice(0, 3)" :key="index"
                    :imageSrc="category.imageSrc" :title="category.title" :buttonColor="category.buttonColor"
                    @click="navigateToCategory(category.title)" />
            </div>

            <RouterLink to="/categories">
                <button class="w-full px-4 py-2 mt-8 text-white bg-black rounded btn md:w-4/12 md:hover:bg-gray-800">
                    Voir
                    plus </button>
            </RouterLink>


            <hr class="mt-6 border-gray-300" id="demo" />

            <!--  Démo avec CardRevision -->
            <div class="mt-12 text-center">
                <h2 class="mb-4 text-[28px] font-bold">Démo</h2>
                <p class="mb-6 text-[18px]">Devine la réponse et clique sur la carte pour vérifier la réponse :</p>
                <div class="flex justify-center">
                    <CardRevision question="2 + 2 = ?" answer="4" />
                </div>
            </div>
            <hr class="mt-6 border-gray-300" />
            <!-- Proposé de s'inscrire -->
            <div v-if="!authStore.isAuthenticated" class="mt-12 text-center">
                <h2 class="mb-4 text-[28px] font-bold">Prêt à démarrer?</h2>
                <p class="mb-6 text-[18px]">Inscris-toi dès maintenant pour explorer toutes les fonctionnalités et
                    commencer ton apprentissage!</p>
                <button
                    class="w-full btn btn-primary px-4 py-2 rounded-[3px] text-[20px] text-white font-semibold h-[49px] bg-[#2698E2] md:hover:bg-[#46a9ef] md:w-4/12">Commencer</button>
            </div>
        </div>
    </section>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import CategorieItem from '@/components/CategorieItem.vue';
import CardRevision from '@/components/CardRevision.vue';
import { useAuthStore } from '@/stores/authStore';

export default defineComponent({
    components: {
        CategorieItem,
        CardRevision
    },
    setup() {
        // Liste des catégories
        const categories = ref([
            { imageSrc: 'src/assets/images/histoire.jpg', title: 'Histoire', buttonColor: '#A88DFF' },
            { imageSrc: 'src/assets/images/programmation.jpg', title: 'Programmation', buttonColor: '#EFD81D' },
            { imageSrc: 'src/assets/images/anglais.jpg', title: 'Anglais', buttonColor: '#6ED3EA' },
            { imageSrc: 'src/assets/images/pays.jpg', title: 'Pays', buttonColor: '#50db4d' },
        ]);

        const authStore = useAuthStore();

        // Utilisation du router pour la navigation
        const router = useRouter();

        // Navigation vers la vue de la catégorie sélectionnée pour afficher les thèmes correspondants
        const navigateToCategory = (categoryTitle: string) => {
            const categorySlug = categoryTitle.toLowerCase();
            router.push({ name: 'themes', params: { category: categorySlug } });
        };

        return {
            categories,
            navigateToCategory,
            authStore
        };
    }
});

</script>

<style scoped></style>
