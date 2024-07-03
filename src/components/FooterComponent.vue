<template>
    <footer class="p-4 py-8 custom-gradient sm:ml-64">
        <div class="flex items-end justify-between max-w-4xl mx-auto mb-8">
            <!-- Logo and Name -->
            <div class="flex items-center">
                <!-- Squelette de chargement pour l'image -->
                <div v-if="!imageLoaded" class="w-6 h-8 mr-2 bg-gray-300 animate-pulse"></div>
                <!-- Image réelle -->
                <img v-show="imageLoaded" src="@/assets/images/logo.svg" alt="Mementos Logo" class="h-8 mr-2"
                    @load="imageLoaded = true" />
                <span class="text-lg font-bold text-[24px] text-white ">Mementos</span>
            </div>
            <!-- Links -->
            <div class="flex">
                <RouterLink to="/cgu" class="mr-2 text-white underline md:hover:text-gray-800">CGU</RouterLink>
                <RouterLink to="/politique-confidentialite" class="mr-2 text-white underline md:hover:text-gray-800">
                    Politique de
                    confidentialité</RouterLink>
            </div>
        </div>
        <!-- Copyright -->
        <div class="py-2 text-sm text-center text-white">
            © 2023 Mementos™. Tous droits réservés.
        </div>
    </footer>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
    setup() {
        const imageLoaded = ref(false);

        return {
            imageLoaded
        };
    }
});

</script>
