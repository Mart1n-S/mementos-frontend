import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useNotificationStore = defineStore('notification', () => {
    const successMessage = ref<string | null>(null);
    const errorMessage = ref<string | null>(null);

    const setSuccessMessage = (message: string) => {
        successMessage.value = message;
        setTimeout(() => {
            successMessage.value = null;
        }, 5000);
    };

    function setErrorMessage(message: string) {
        errorMessage.value = message;
        setTimeout(() => {
            errorMessage.value = null;
        }, 3000);
    }

    return {
        successMessage,
        setSuccessMessage,
        setErrorMessage,
        errorMessage
    };
});