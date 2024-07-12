<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';

export default defineComponent({
    setup() {
        const imageLoaded = ref(false);
        const authStore = useAuthStore();

        onMounted(() => {
            authStore.checkAuth();
        });

        return {
            imageLoaded,
            authStore
        };
    }
});
</script>

<template>
    <nav class="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div class="px-3 py-3 lg:px-5 lg:pl-3">
            <div class="flex items-center justify-between">
                <div class="flex items-center justify-start rtl:justify-end">
                    <button data-drawer-target="logo-sidebar" data-drawer-toggle="logo-sidebar"
                        aria-controls="logo-sidebar" type="button"
                        class="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                        <span class="sr-only">Ouvrir sidebar</span>
                        <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg">
                            <path clip-rule="evenodd" fill-rule="evenodd"
                                d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z">
                            </path>
                        </svg>
                    </button>
                    <RouterLink to="/" class="flex ms-2 md:me-24">
                        <!-- Squelette de chargement pour l'image -->
                        <div v-if="!imageLoaded" class="mr-2 bg-gray-300 w-7 h-9 animate-pulse"></div>
                        <!-- Image réelle -->
                        <img v-show="imageLoaded" src="@/assets/images/logo.svg" alt="Mementos Logo"
                            class="mr-2 h-9 w-9" @load="imageLoaded = true" />
                        <span
                            class="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">Mementos</span>
                    </RouterLink>
                </div>
                <div class="flex items-center">
                    <div class="flex items-center ms-3">
                        <div>
                            <button type="button"
                                class="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                                aria-expanded="false" data-dropdown-toggle="dropdown-user">
                                <span class="sr-only">Open user menu</span>

                                <svg width="30" height="30" fill="none" stroke="#ffffff" stroke-linecap="round"
                                    stroke-linejoin="round" stroke-width="1" viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z"></path>
                                    <path d="M21 22a9 9 0 1 0-18 0"></path>
                                </svg>
                            </button>
                        </div>
                        <div class="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded shadow dark:bg-gray-700 dark:divide-gray-600"
                            id="dropdown-user">
                            <div v-if="authStore.isAuthenticated" class="px-4 py-3" role="none">
                                <p class="text-sm text-gray-900 dark:text-white" role="none">
                                    {{ authStore.user?.pseudo }}
                                </p>
                                <p class="text-sm font-medium text-gray-900 truncate dark:text-gray-300" role="none">
                                    {{ authStore.user?.email }}
                                </p>
                            </div>
                            <ul v-if="authStore.isAuthenticated" class="py-1" role="none">
                                <li>
                                    <RouterLink to="/profil"
                                        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                                        role="menuitem">Profil</RouterLink>
                                </li>
                                <li>
                                    <button @click="authStore.logout"
                                        class="block w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                                        role="menuitem">Déconnexion</button>
                                </li>
                            </ul>
                            <ul v-else class="py-1" role="none">
                                <li>
                                    <RouterLink to="/connexion"
                                        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                                        role="menuitem">Connexion</RouterLink>
                                </li>
                                <li>
                                    <RouterLink to="/inscription"
                                        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                                        role="menuitem">Inscription</RouterLink>
                                </li>
                                <li>
                                    <RouterLink to="/invite"
                                        class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white"
                                        role="menuitem">Invité</RouterLink>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </nav>

    <aside id="logo-sidebar"
        class="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
        aria-label="Sidebar">
        <div class="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
            <ul class="space-y-8 font-medium">
                <li>
                    <RouterLink to="/"
                        class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                        <svg class="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                            aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                            viewBox="0 0 24 24">
                            <path
                                d="m20.512 9.72-7.5-6.815a1.5 1.5 0 0 0-2.024 0l-7.5 6.816A1.5 1.5 0 0 0 3 10.827v8.634c-.006.378.127.746.375 1.032a1.492 1.492 0 0 0 1.125.506H9a.75.75 0 0 0 .75-.75v-4.5a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 0 .75.75h4.5c.249.002.494-.06.712-.178A1.51 1.51 0 0 0 21 19.499v-8.672a1.5 1.5 0 0 0-.488-1.106Z">
                            </path>
                        </svg>
                        <span class="ms-3 text-[20px]">Accueil</span>
                    </RouterLink>
                </li>
                <li>
                    <RouterLink to="/categories"
                        class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                        <svg class="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                            aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor"
                            viewBox="0 0 18 18">
                            <path
                                d="M6.143 0H1.857A1.857 1.857 0 0 0 0 1.857v4.286C0 7.169.831 8 1.857 8h4.286A1.857 1.857 0 0 0 8 6.143V1.857A1.857 1.857 0 0 0 6.143 0Zm10 0h-4.286A1.857 1.857 0 0 0 10 1.857v4.286C10 7.169 10.831 8 11.857 8h4.286A1.857 1.857 0 0 0 18 6.143V1.857A1.857 1.857 0 0 0 16.143 0Zm-10 10H1.857A1.857 1.857 0 0 0 0 11.857v4.286C0 17.169.831 18 1.857 18h4.286A1.857 1.857 0 0 0 8 16.143v-4.286A1.857 1.857 0 0 0 6.143 10Zm10 0h-4.286A1.857 1.857 0 0 0 10 11.857v4.286c0 1.026.831 1.857 1.857 1.857h4.286A1.857 1.857 0 0 0 18 16.143v-4.286A1.857 1.857 0 0 0 16.143 10Z" />
                        </svg>
                        <span class="ms-3 text-[20px]">Catégories</span>
                    </RouterLink>
                </li>
                <li v-if="authStore.isAuthenticated">
                    <RouterLink to="/mes-themes"
                        class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                        <svg class="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                            width="25" height="36" viewBox="0 0 21 32" fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M0.141468 2.18391C0.142351 1.3425 0.794697 0.659726 1.59852 0.658894L19.4279 0.640438C20.2317 0.639606 20.8826 1.32103 20.8817 2.16244L20.853 29.5857C20.8521 30.4271 20.1997 31.1098 19.3959 31.1107L1.56655 31.1291C0.762721 31.13 0.111807 30.4485 0.11269 29.6071L0.141468 2.18391Z" />
                            <path
                                d="M11.3492 24.1099C13.2791 22.427 16.7648 24.1042 16.7737 15.6553C16.7741 15.2611 16.7389 14.8752 16.6711 14.5004C11.5548 12.8887 5.89563 13.8378 3.70562 14.5138C3.63704 14.8888 3.60105 15.2748 3.60063 15.669C3.59177 24.1179 7.08095 22.4334 9.00734 24.1123C9.57694 24.6087 10.0104 24.9026 10.1774 24.9024C10.3445 24.9022 10.7786 24.6074 11.3492 24.1099Z"
                                fill="white" />
                            <path fill-rule="evenodd" clip-rule="evenodd"
                                d="M10.294 9.24465C11.8906 8.57473 15.3411 7.77014 16.9533 9.70196C18.5905 11.6638 17.6325 13.3107 16.9489 13.889C16.1267 13.5557 13.6543 12.8929 10.3014 12.8853C6.93717 12.8969 4.45417 13.5671 3.62946 13.9028C2.94703 13.326 1.99249 11.6811 3.63386 9.71581C5.25004 7.78071 8.69872 8.57804 10.294 9.24465Z"
                                fill="white" />
                            <path
                                d="M11.013 8.67704C10.726 9.21565 9.95458 9.21645 9.66871 8.67844V8.67844C9.3994 8.17158 9.76758 7.55931 10.342 7.55872V7.55872C10.9165 7.55812 11.2834 8.16963 11.013 8.67704V8.67704Z"
                                fill="white" />
                        </svg>
                        <span class="ms-3 text-[20px]">Mes thèmes</span>
                    </RouterLink>
                </li>
                <li v-if="authStore.isAuthenticated">
                    <RouterLink to="/creer-themes"
                        class="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                        <svg class="flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"
                            width="20" height="20" fill="currentColor" viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Zm7 8H7v2h4v4h2v-4h4v-2h-4V7h-2v4Z">
                            </path>
                        </svg>
                        <span class="ms-3 text-[20px]">Creer un thème</span>
                    </RouterLink>
                </li>
            </ul>
        </div>
    </aside>
</template>

<style scoped></style>
