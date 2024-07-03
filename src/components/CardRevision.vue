<template>
    <div class="w-full h-64 mx-auto my-5 perspective-1000 md:w-5/12" @click="flipCard">
        <div class="relative w-full h-full transition-transform cursor-pointer duration-600 transform-style-3d"
            :class="{ 'rotate-y-180': isFlipped }">
            <div
                class="absolute top-0 left-0 flex items-center justify-center w-full h-full text-white bg-[#40C69F] rounded-lg backface-hidden">
                <p class="text-[48px]">{{ question }}</p>
            </div>
            <div
                class="absolute top-0 left-0 flex items-center justify-center w-full h-full text-white transform bg-[#FF4F79] rounded-lg rotate-y-180 backface-hidden">
                <p class="text-[48px]">{{ answer }}</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
    props: {
        question: {
            type: String,
            required: true,
        },
        answer: {
            type: String,
            required: true,
        },
    },
    setup(props) {
        const isFlipped = ref(false);

        const flipCard = () => {
            isFlipped.value = !isFlipped.value;
        };

        return {
            isFlipped,
            flipCard,
            ...props
        };
    }
});
</script>

<style scoped>
.perspective-1000 {
    perspective: 1000px;
}

.rotate-y-180 {
    transform: rotateY(180deg);
}

.transform-style-3d {
    transition: transform 0.5s;
    transform-style: preserve-3d;
}

.backface-hidden {
    backface-visibility: hidden;
}
</style>
