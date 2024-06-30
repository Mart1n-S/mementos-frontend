<template>
    <div class="relative w-full max-w-md">
        <input :value="modelValue" @input="updateValue" type="text" placeholder="Rechercher"
            class="w-full py-2 pl-12 pr-4 text-gray-900 rounded-md focus:outline-none focus:ring focus:border-blue-300" />

        <svg class="absolute transform -translate-y-1/2 left-3 top-1/2" width="24" height="24" fill="none"
            stroke="#696969" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg">
            <path d="M10.5 19a8.5 8.5 0 1 0 0-17 8.5 8.5 0 0 0 0 17Z"></path>
            <path d="M13.328 7.172A3.988 3.988 0 0 0 10.5 6a3.988 3.988 0 0 0-2.828 1.172"></path>
            <path d="m16.61 16.611 4.244 4.243"></path>
        </svg>
    </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

defineProps({
    modelValue: {
        type: String,
        required: true
    }
});

const emits = defineEmits(['update:modelValue']);

const updateValue = (event: Event) => {
    emits('update:modelValue', (event.target as HTMLInputElement).value);
};
</script>

<style scoped></style>
