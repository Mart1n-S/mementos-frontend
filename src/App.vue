<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterView } from 'vue-router'
import NavigationBar from '@/components/NavigationBar.vue';
import { useAuthStore } from '@/stores/authStore';

const authStore = useAuthStore();

onMounted(() => {
  authStore.checkAuth();
});
</script>

<template>
  <NavigationBar />
  <RouterView />
</template>

<style scoped></style>
