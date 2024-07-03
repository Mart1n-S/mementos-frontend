<template>
    <div class="relative">
        <button :style="{ backgroundColor: buttonColor }"
            class="flex items-center justify-between w-full btn px-4 py-2 text-[20px] font-semibold text-white rounded-[3px] h-[49px]">
            {{ title }}
            <span class="material-icons">
                <svg width="30" height="30" fill="#ffffff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M12 2.25A9.75 9.75 0 1 0 21.75 12 9.769 9.769 0 0 0 12 2.25Zm4.444 10.04a.816.816 0 0 1-.169.244l-3.178 3.178a.711.711 0 0 1-.525.216.73.73 0 0 1-.534-.216.75.75 0 0 1 0-1.059l1.903-1.903H8.25a.75.75 0 1 1 0-1.5h5.69l-1.902-1.903a.75.75 0 0 1 1.059-1.06l3.178 3.179c.07.07.128.152.169.243a.779.779 0 0 1 0 .582Z">
                    </path>
                </svg>
            </span>
        </button>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    props: {
        title: {
            type: String,
            required: true
        },
        buttonColor: {
            type: String,
            required: true
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
