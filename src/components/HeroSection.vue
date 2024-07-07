<template>
    <div class="flex flex-col items-center justify-center p-4 py-10 text-center text-white hero-section">
        <!-- Squelette de chargement pour l'image -->
        <div v-if="!imageLoaded" class="h-32 mb-8 bg-gray-300 w-28 animate-pulse"></div>
        <!-- Image réelle -->
        <img v-show="imageLoaded" src="@/assets/images/logo.svg" alt="Mementos Logo" class="w-32 h-32 mb-8"
            @load="imageLoaded = true" />


        <h1 class="mb-4 text-[50px] font-bold">MEMENTOS</h1>
        <p class="mb-8 text-[22px]">Améliore ta mémoire durablement avec la répétition espacée.</p>
        <div class="flex flex-col w-full space-y-4 md:w-4/12">
            <RouterLink to="/login"
                class="btn btn-primary px-4 py-2 rounded-[3px] text-[20px] text-white font-semibold h-[49px] bg-[#2698E2] md:hover:bg-[#46a9ef]">
                Commencer
            </RouterLink>
            <a href="#demo"
                class="btn btn-secondary px-4 py-2 rounded-[3px] text-[20px] text-white font-semibold h-[49px] bg-[#FF4F79] md:hover:bg-[#ff3c87]">Démo</a>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
    setup() {
        // 'imageLoaded' est une variable réactive utilisée pour suivre l'état de chargement de l'image.
        // Elle est initialisée à 'false', ce qui signifie que l'image n'est pas encore chargée.
        // Lorsque l'image est complètement chargée, cet état passe à 'true'.
        const imageLoaded = ref(false);

        return {
            imageLoaded
        };
    }
});
</script>

<style scoped></style>
