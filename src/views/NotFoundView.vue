<template>
    <main class="flex flex-col items-center justify-center h-screen bg-gray-100">
        <h1 class="mb-2 text-4xl font-bold text-gray-800">404 - Page Non Trouvée</h1>
        <p class="mb-4 text-lg text-gray-600">Oups! La page que vous cherchez n'existe pas.</p>
        <router-link to="/" class="px-6 py-3 text-white bg-[#2698E2] rounded md:hover:bg-[#46a9ef]">
            Retour à l'accueil
        </router-link>
    </main>
</template>

<script setup lang="ts">
</script>

<style scoped></style>
