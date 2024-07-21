<template>
    <div class="p-4 mb-4">
        <p v-if="niveau !== undefined" class="mt-2 text-[18px] font-semibold text-center text-gray-700">
            Niveau : {{ niveau }}
        </p>
        <p class="mb-2 text-[20px] text-start">Question :</p>
        <div :style="{ backgroundColor: color }" class="p-4 mb-2 text-xl font-semibold rounded">
            {{ question }}
        </div>
        <p class="mb-2 text-[20px] text-start">Réponse :</p>
        <div class="p-4 text-xl font-semibold bg-[#92FF90] rounded">
            {{ reponse }}
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    props: {
        question: {
            type: String,
            required: true
        },
        reponse: {
            type: String,
            required: true
        },
        color: {
            type: String,
            required: true
        },
        niveau: {
            type: Number,
            required: false
        }
    },
    setup(props) {
        return {
            ...props
        };
    }
});
</script>

<style scoped></style>
