<template>
    <footer class="p-4 py-8 bg-[#272a2c] sm:ml-64">
        <div class="flex items-end justify-between max-w-4xl mx-auto mb-8">
            <!-- Logo and Name -->
            <div class="flex items-center">
                <img src="@/assets/images/logo.svg" alt="Mementos Logo" class="h-8 mr-2">
                <span class="text-lg font-bold text-[24px] text-white ">Mementos</span>
            </div>
            <!-- Links -->
            <div class="flex">
                <a href="#cgu" class="mr-2 text-white underline md:hover:text-gray-800">CGU</a>
                <a href="#privacy" class="text-white underline md:hover:text-gray-800">Politique de
                    confidentialité</a>
            </div>
        </div>
        <!-- Copyright -->
        <div class="py-2 text-sm text-center text-white">
            © 2023 Mementos™. Tous droits réservés.
        </div>
    </footer>
</template>

<script>
export default {
    name: 'FooterComponent'
}
</script>
