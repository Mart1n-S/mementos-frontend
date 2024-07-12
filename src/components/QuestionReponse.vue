<template>
    <div class="my-8">
        <hr class="mb-6 border-gray-300" />
        <h2 class="font-medium text-center text-[22px] text-gray-900">Carte {{ index + 1 }}</h2>
        <label :for="'question-' + index"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Question</label>
        <input :id="'question-' + index" :name="'question-' + index" v-model="questionText" type="text"
            placeholder="Question ?" min="1" max="255"
            class="block w-full p-4 mb-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50" required />
        <p v-if="errors && errors.question" class="mt-2 text-sm text-red-600 dark:text-red-500">
            <span class="font-medium">Oops!</span> {{ errors.question[0] }}
        </p>
        <label :for="'reponse-' + index"
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Réponse</label>
        <input :id="'reponse-' + index" :name="'reponse-' + index" v-model="reponseText" type="text"
            placeholder="Réponse" min="1" max="255"
            class="block w-full p-4 mb-2 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50" required />
        <p v-if="errors && errors.reponse" class="mt-2 text-sm text-red-600 dark:text-red-500">
            <span class="font-medium">Oops!</span> {{ errors.reponse[0] }}
        </p>
        <button v-if="index !== 0" @click="$emit('remove', index)" type="button"
            class="px-4 py-2 text-[16px] font-semibold h-[49px] text-white bg-red-500 rounded">
            Supprimer
        </button>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';

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
        index: {
            type: Number,
            required: true
        },
        errors: {
            type: Object,
            required: false,
            default: () => ({})
        }
    },
    emits: ['remove', 'update'],
    setup(props, { emit }) {
        const questionText = ref(props.question);
        const reponseText = ref(props.reponse);

        watch([questionText, reponseText], () => {
            emit('update', { index: props.index, question: questionText.value, reponse: reponseText.value });
        });

        return {
            questionText,
            reponseText
        };
    }
});
</script>

<style scoped></style>
