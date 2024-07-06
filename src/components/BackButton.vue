<template>
    <div class="w-full mb-4 text-left">
        <button @click="goBack" class="text-white hover:text-gray-300">
            <svg width="35" height="35" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                stroke-width="3" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M2.9 12h18"></path>
                <path d="m8.9 18-6-6 6-6"></path>
            </svg>
        </button>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'BackButton',
    methods: {
        goBack() {
            this.$router.go(-1);
        },
    },
});
</script>
