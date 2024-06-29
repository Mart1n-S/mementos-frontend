<template>
    <div class="flex flex-col items-center justify-center py-10 text-center text-black hero-section">
        <img src="@/assets/images/logo.svg" alt="Mementos Logo" class="w-32 h-32 mb-8" />
        <h1 class="mb-4 text-[50px] font-bold">MEMENTOS</h1>
        <p class="mb-8 text-[22px]">Améliore ta mémoire durablement avec la répétition espacée.</p>
        <div class="flex flex-col w-full space-y-4 md:w-4/12">
            <RouterLink to="/start" class="btn btn-primary">Commencer</RouterLink>
            <a href="#demo" class="btn btn-secondary">Démo</a>
        </div>
    </div>
</template>

<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<style scoped>
.btn {
    @apply px-4 py-2 rounded-[3px] text-[20px] text-white font-semibold h-[49px];
}

.btn-primary {
    @apply bg-[#2698E2] md:hover:bg-[#46a9ef];
}

.btn-secondary {
    @apply bg-[#FF4F79] md:hover:bg-[#ff3c87];
}
</style>
