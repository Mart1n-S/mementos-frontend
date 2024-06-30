<template>
    <main>
        <section class="sm:ml-64 custom-gradient md:p-4">
            <div class="mt-14">
                <div class="flex flex-col items-center justify-center p-4 py-10 text-center text-white">
                    <!-- Bouton de retour -->
                    <div class="w-full mb-4 text-left">
                        <button @click="goBack" class="text-white hover:text-gray-300">
                            <svg width="35" height="35" fill="none" stroke="#ffffff" stroke-linecap="round"
                                stroke-linejoin="round" stroke-width="3" viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M2.9 12h18"></path>
                                <path d="m8.9 18-6-6 6-6"></path>
                            </svg>
                        </button>
                    </div>
                    <h1 class="mb-4 text-[50px] font-bold">THEMES</h1>
                    <p class="mb-8 text-[22px]">Retrouve ici tous les thèmes de la catégorie {{ category }}</p>

                    <!-- Barre de recherche -->
                    <SearchBar :modelValue="searchQuery" @update:modelValue="searchQuery = $event" />
                </div>

                <div class="min-h-screen py-10 bg-white rounded-t-3xl">
                    <div class="container px-4 mx-auto text-center sm:px-6">
                        <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
                            <!-- Afficher un message s'il n'y a pas de thèmes pour la catégorie -->
                            <div v-if="themesForCategory.length === 0"
                                class="col-span-1 text-2xl font-bold text-gray-700 md:col-span-2">
                                Aucun thème pour cette catégorie
                            </div>
                            <!-- Afficher un message s'il n'y a pas de résultats pour la recherche -->
                            <div v-else-if="filteredThemes.length === 0"
                                class="col-span-1 text-2xl font-bold text-gray-700 md:col-span-2">
                                Aucun résultat
                            </div>

                            <!-- Afficher les thèmes -->
                            <ThemeItem v-for="theme in filteredThemes" :key="theme.title" :title="theme.title"
                                :buttonColor="theme.buttonColor" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>
    <FooterComponent />
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import FooterComponent from '@/components/FooterComponent.vue';
import SearchBar from '@/components/SearchBar.vue';
import ThemeItem from '@/components/ThemeItem.vue';

// Définir les props
const props = defineProps({
    category: {
        type: String,
        required: true
    }
});

// Exemples de thèmes pour différentes catégories
const themes = ref([
    { category: 'Programmation', title: 'Javascript', buttonColor: '#EFD81D' },
    { category: 'Programmation', title: 'PHP', buttonColor: '#EFD81D' },
    { category: 'Programmation', title: 'REACT', buttonColor: '#EFD81D' },
    { category: 'Programmation', title: 'HTML', buttonColor: '#EFD81D' },
    { category: 'Programmation', title: 'CSS', buttonColor: '#EFD81D' },
]);

// Modèle pour la barre de recherche
const searchQuery = ref('');

// Calcul des thèmes filtrés par catégorie
const themesForCategory = computed(() => {
    return themes.value.filter(theme =>
        theme.category.toLowerCase() === props.category.toLowerCase()
    );
});

// Calcul des thèmes filtrés par la recherche
const filteredThemes = computed(() => {
    return themesForCategory.value.filter(theme =>
        theme.title.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
});

// Utilisation du router pour la navigation
const router = useRouter();

// Fonction de retour
const goBack = () => {
    router.back();
};
</script>

<style scoped></style>
