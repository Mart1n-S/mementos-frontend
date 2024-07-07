<template>
  <main>
    <section class="sm:ml-64 custom-gradient md:p-4">
      <div class="mt-14">
        <div class="flex flex-col items-center justify-center p-4 py-10 text-center text-white">
          <BackButton />
          <h1 class="mb-4 text-[50px] font-bold">CATEGORIES</h1>
          <p class="mb-8 text-[22px]">Retrouve ici toutes les catégories</p>

          <!-- Barre de recherche -->
          <SearchBar :modelValue="searchQuery" @update:modelValue="searchQuery = $event" />
        </div>

        <div class="min-h-screen py-10 bg-white rounded-t-3xl">
          <div class="container px-4 mx-auto text-center sm:px-6">

            <div v-if="filteredCategories.length > 0" class="grid grid-cols-1 gap-8 md:grid-cols-2">
              <CategorieItem v-for="category in filteredCategories" :key="category.id" :categorie="category"
                @click="navigateToCategory(category.nom)" />
            </div>
            <div v-else class="col-span-1 text-2xl font-bold text-gray-700 md:col-span-2">
              <p>Aucune catégorie trouvée.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </main>
  <FooterComponent />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import FooterComponent from '@/components/FooterComponent.vue';
import CategorieItem from '@/components/CategorieItem.vue';
import SearchBar from '@/components/SearchBar.vue';
import BackButton from '@/components/BackButton.vue';
import { useCategorieStore } from '@/stores/categorieStore';

// Utilisation du store des catégories
const categorieStore = useCategorieStore();

// Modèle pour la barre de recherche
const searchQuery = ref('');

// État de chargement
const isLoading = ref(true);

// Récupérer les catégories au montage du composant
onMounted(async () => {
  await categorieStore.fetchCategories();
  isLoading.value = false;
});

// Calcul des catégories filtrées
const filteredCategories = computed(() => {
  if (!searchQuery.value) {
    return categorieStore.categories;
  }
  return categorieStore.categories.filter(category =>
    category.nom.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// Navigation vers la vue de la catégorie sélectionnée pour afficher les thèmes correspondants
const router = useRouter();
const navigateToCategory = (categoryTitle: string) => {
  const categorySlug = categoryTitle.toLowerCase();
  router.push({ name: 'themes', params: { category: categorySlug } });
};

</script>

<style scoped></style>
