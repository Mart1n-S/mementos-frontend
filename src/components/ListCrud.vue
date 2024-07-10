<template>
    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
                <th scope="col" class="px-4 py-4 text-center">Id</th>
                <th scope="col" class="px-4 py-3 text-center">Question</th>
                <th scope="col" class="px-4 py-3 text-center">Réponse</th>
                <th scope="col" class="px-4 py-3 text-center">Action</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(card, index) in cards" :key="card.id" class="border-b dark:border-gray-700">
                <th scope="row"
                    class="px-4 py-3 font-medium text-center text-gray-900 whitespace-nowrap dark:text-white">
                    {{ index + 1 }}
                </th>
                <td class="px-4 py-3 text-center truncate max-w-[150px] sm:max-w-xs">{{ card.question }}</td>
                <td class="px-4 py-3 text-center truncate max-w-[150px] sm:max-w-xs">{{ card.reponse }}</td>
                <td class="flex items-center justify-center px-4 py-3">
                    <button @click="toggleDropdown(card.id)"
                        class="inline-flex items-center text-sm font-medium md:hover:bg-gray-100 dark:hover:bg-gray-700 p-1.5 dark:hover-bg-gray-800 text-center text-gray-500 hover:text-gray-800 rounded-lg dark:text-gray-400 dark:hover:text-gray-100"
                        type="button">
                        <svg class="w-5 h-5" aria-hidden="true" fill="currentColor" viewbox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
                        </svg>
                    </button>
                    <div v-show="isDropdownOpen(card.id)"
                        class="absolute z-10 mb-[175px] bg-white divide-y divide-gray-100 rounded shadow w-44 dark:bg-gray-700 dark:divide-gray-600">
                        <ul class="py-1 text-sm" :aria-labelledby="`dropdown-button-${card.id}`">
                            <li>
                                <button type="button" @click="editCard(card)"
                                    class="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white dark:text-gray-200">
                                    <svg width="18" height="18" class="mr-2" fill="none" stroke="#737373"
                                        stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M3.5 21h18"></path>
                                        <path d="M5.5 13.36V17h3.659L19.5 6.654 15.848 3 5.5 13.36Z"></path>
                                    </svg>
                                    Modifier
                                </button>
                            </li>
                            <li>
                                <button type="button" @click="viewCard(card)"
                                    class="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white dark:text-gray-200">
                                    <svg width="18" height="18" class="mr-2" fill="none" stroke="#737373"
                                        stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M12 20.5c4.97 0 9-4.161 9-7 0-2.839-4.03-7-9-7s-9 4.164-9 7c0 2.836 4.03 7 9 7Z"
                                            clip-rule="evenodd"></path>
                                        <path d="M12 16.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"></path>
                                        <path d="m6.632 5.633 1.297 1.81"></path>
                                        <path d="m17.813 5.855-1.298 1.81"></path>
                                        <path d="M12.004 3.5v3"></path>
                                    </svg>
                                    Voir
                                </button>
                            </li>
                            <li>
                                <button type="button" @click="deleteCard(card.id)"
                                    class="flex items-center w-full px-4 py-2 text-red-500 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-red-400">
                                    <svg width="18" height="18" fill="none" stroke="#F05252" stroke-linecap="round"
                                        class="mr-2" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24"
                                        xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4.5 5v17h15V5h-15Z"></path>
                                        <path d="M10 10v6.5"></path>
                                        <path d="M14 10v6.5"></path>
                                        <path d="M2 5h20"></path>
                                        <path d="m8 5 1.645-3h4.744L16 5H8Z"></path>
                                    </svg>
                                    Supprimer
                                </button>
                            </li>
                        </ul>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import type { PropType } from 'vue';
import type { Carte } from '@/models/Carte';

export default defineComponent({
    props: {
        cards: {
            type: Array as PropType<Carte[]>,
            required: true
        }
    },
    setup() {
        const openDropdown = ref<number | null>(null);


        const toggleDropdown = (id: number) => {
            if (openDropdown.value === id) {
                openDropdown.value = null;
            } else {
                openDropdown.value = id;
            }
        };

        const isDropdownOpen = (id: number) => {
            return openDropdown.value === id;
        };

        return {
            toggleDropdown,
            isDropdownOpen
        };
    },
    methods: {
        viewCard(card: Carte) {
            this.$emit('viewCard', card);
        },
        editCard(card: Carte) {
            this.$emit('editCard', card);
        },
        deleteCard(id: number) {
            this.$emit('deleteCard', id);
        },
    }
});
</script>

<style scoped></style>
