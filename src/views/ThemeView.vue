<template>
    <main>
        <section class="sm:ml-64 custom-gradient md:p-4">
            <div class="mt-14">
                <div class="flex flex-col items-center justify-center p-4 py-10 text-center text-white">
                    <BackButton />
                    <h1 class="mb-4 text-[50px] font-bold">THEMES</h1>
                    <p class="mb-8 text-[22px]">Retrouve ici tous les thèmes de la catégorie {{ category }}</p>

                    <SearchBar :modelValue="searchQuery" @update:modelValue="searchQuery = $event" />
                </div>

                <div class="min-h-screen py-10 bg-white rounded-t-3xl">
                    <div class="container px-4 mx-auto text-center sm:px-6">
                        <div v-if="filteredThemes.length > 0" class="grid grid-cols-1 gap-8 md:grid-cols-2">
                            <ThemeItem v-for="theme in filteredThemes" :key="theme.id" :theme="theme" />
                        </div>
                        <div v-else class="col-span-1 text-2xl font-bold text-gray-700 md:col-span-2">
                            <p>Aucun thème pour cette catégorie</p>
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
import FooterComponent from '@/components/FooterComponent.vue';
import SearchBar from '@/components/SearchBar.vue';
import ThemeItem from '@/components/ThemeItem.vue';
import BackButton from '@/components/BackButton.vue';
import { useThemeStore } from '@/stores/themeStore';

const props = defineProps({
    category: {
        type: String,
        required: true
    }
});

const searchQuery = ref('');

const themeStore = useThemeStore();

onMounted(async () => {
    await themeStore.fetchThemesByCategory(props.category);
});

const filteredThemes = computed(() => {
    if (!searchQuery.value) {
        return themeStore.themes;
    }
    return themeStore.themes.filter(theme =>
        theme.nom.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
});

</script>

<style scoped></style>
