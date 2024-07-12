import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useNotificationStore = defineStore('notification', () => {
    const successMessage = ref<string | null>(null);

    const setSuccessMessage = (message: string) => {
        successMessage.value = message;
        setTimeout(() => {
            successMessage.value = null;
        }, 5000);
    };

    return {
        successMessage,
        setSuccessMessage,
    };
});