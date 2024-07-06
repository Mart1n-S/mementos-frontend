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

        <div class="py-10 bg-white rounded-t-3xl">
          <div class="container px-4 mx-auto text-center sm:px-6">
            <div class="grid grid-cols-1 gap-8 md:grid-cols-2">
              <CategorieItem v-for="category in filteredCategories" :key="category.title" :imageSrc="category.imageSrc"
                :title="category.title" :buttonColor="category.buttonColor"
                @click="navigateToCategory(category.title)" />
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
import CategorieItem from '@/components/CategorieItem.vue';
import SearchBar from '@/components/SearchBar.vue';
import BackButton from '@/components/BackButton.vue';

// Liste des catégories
const categories = ref([
  { imageSrc: 'src/assets/images/histoire.jpg', title: 'Histoire', buttonColor: '#A88DFF' },
  { imageSrc: 'src/assets/images/programmation.jpg', title: 'Programmation', buttonColor: '#EFD81D' },
  { imageSrc: 'src/assets/images/anglais.jpg', title: 'Anglais', buttonColor: '#6ED3EA' },
  { imageSrc: 'src/assets/images/pays.jpg', title: 'Pays', buttonColor: '#50db4d' },
]);

// Modèle pour la barre de recherche
const searchQuery = ref('');

// Calcul des catégories filtrées
const filteredCategories = computed(() => {
  if (!searchQuery.value) {
    return categories.value;
  }
  return categories.value.filter(category =>
    category.title.toLowerCase().includes(searchQuery.value.toLowerCase())
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
