import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from '@/modules/axios';
import { useRouter } from 'vue-router';
import type { User } from '@/models/User';
import { useGuestStore } from '@/stores/guestStore';

export const useAuthStore = defineStore('auth', () => {
    const router = useRouter();
    const isAuthenticated = ref(false);
    const user = ref<User | null>(null);
    const errorMessage = ref<string | null>(null);
    const validationErrors = ref<{ [key: string]: string }>({});
    const successMessage = ref<string | null>(null);
    const guestStore = useGuestStore();

    /**
     * Récupère les données de l'utilisateur
     */
    async function fetchUser() {
        try {
            const token = localStorage.getItem('access_token');
            const response = await axios.get<User>('/user', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            user.value = response.data;
            localStorage.setItem('user', JSON.stringify(user.value));
        } catch (error) {
            console.error('Échec de la récupération des données utilisateur:', error);
        }
    }

    /**
     * Enregistre un nouvel utilisateur
     * @param pseudo 
     * @param email 
     * @param niveauRevision 
     * @param password 
     * @param confirmPassword 
     * @param terms 
     * @returns 
     */
    async function register(pseudo: string, email: string, niveauRevision: string, password: string, confirmPassword: string, terms: boolean) {
        try {
            errorMessage.value = null;
            validationErrors.value = {};

            if (password !== confirmPassword) {
                validationErrors.value.password = "Les mots de passe ne correspondent pas";
                return;
            }
            if (!terms) {
                validationErrors.value.terms = "Vous devez accepter les conditions générales d'utilisation";
                return;
            }

            const response = await axios.post('/create-user', {
                pseudo,
                email,
                niveauRevision,
                password,
                password_confirmation: confirmPassword
            });

            if (response.status === 201) {
                console.log("Inscription réussie !");
                // Supprime toutes les données de l'invité dans indexedDB et guestStore
                await guestStore.deleteAllData();
                const token = response.data.token;
                localStorage.setItem('access_token', token);

                // Fetch user data after registration
                await fetchUser();

                isAuthenticated.value = true;
                router.push('/profil');
            }
        } catch (error: any) {
            if (error.response && error.response.data) {
                console.log(error.response.data);
                if (error.response.status === 409) {
                    validationErrors.value.email = "Cet email est déjà utilisé.";
                } else if (error.response.status === 422) {
                    const validationErrorsData = error.response.data.errors;
                    for (const key in validationErrorsData) {
                        if (Object.prototype.hasOwnProperty.call(validationErrorsData, key)) {
                            validationErrors.value[key] = validationErrorsData[key][0];
                        }
                    }
                } else {
                    errorMessage.value = "Erreur lors de l'inscription : " + (error.response.data.message || '');
                }
            } else {
                console.log(error);
                errorMessage.value = "Erreur interne du serveur !";
            }
        }
    }

    /**
     * Envoie les informations de connexion
     * @param email 
     * @param password 
     */
    async function login(email: string, password: string) {
        try {
            const response = await axios.post('/login', { email, password });
            const token = response.data.token;

            localStorage.setItem('access_token', token);
            errorMessage.value = null;

            await fetchUser();

            isAuthenticated.value = true;

            router.push('/profil');
        } catch (error: any) {
            if (error.response && error.response.status === 401) {
                errorMessage.value = 'Oops! Les identifiants sont incorrects.';
            } else {
                errorMessage.value = 'Erreur lors de la connexion.';
            }
        }
    }

    const updateUser = async (userId: number, formData: { pseudo: string; niveauRevision: number }) => {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                errorMessage.value = "Vous devez être connecté pour effectuer cette action.";
                return;
            }

            const response = await axios.put(
                `/user/${userId}`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200) {
                // Mettre à jour les informations de l'utilisateur dans le store
                await fetchUser();
                successMessage.value = "Informations mises à jour avec succès.";
            }
        } catch (error: any) {
            if (error.response.status === 422) {
                validationErrors.value = error.response.data.errors;
            } else {
                errorMessage.value = error.response.data.message || "Une erreur s'est produite lors de la mise à jour.";
            }
        }
    };

    /**
     * Envoie une demande de réinitialisation de mot de passe
     * @param email 
     */
    async function forgotPassword(email: string) {
        try {
            await axios.post('/forgot-password', { email });
            successMessage.value = 'Si un compte existe avec cet email, un email de réinitialisation vous sera envoyé.';
            errorMessage.value = null;
        } catch (error: any) {
            errorMessage.value = 'Erreur lors de l\'envoi de l\'email de réinitialisation.';
            successMessage.value = null;
        }
    }

    /**
     * Réinitialise le mot de passe
     * @param token 
     * @param email 
     * @param password 
     * @param passwordConfirmation 
     */
    async function resetPassword(token: string, email: string, password: string, passwordConfirmation: string) {
        try {
            await axios.post('/reset-password', {
                token,
                email,
                password,
                password_confirmation: passwordConfirmation
            });
            successMessage.value = 'Mot de passe réinitialisé avec succès.';
            errorMessage.value = null;
            router.push({ name: 'connexion', query: { reset: 'success' } });
        } catch (error: any) {
            errorMessage.value = 'Erreur lors de la réinitialisation du mot de passe.';
            successMessage.value = null;
        }
    }

    /**
     * Déconnecte l'utilisateur
     */
    async function logout() {
        try {
            const token = localStorage.getItem('access_token');
            await axios.post('/logout', {}, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            isAuthenticated.value = false;
            user.value = null;
            localStorage.removeItem('access_token');
            localStorage.removeItem('user');
            router.push('/');
        } catch (error) {
            console.error('Failed to logout:', error);
        }
    }

    /**
     * Charge l'utilisateur depuis le stockage local
     */
    function loadUserFromLocalStorage() {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            user.value = JSON.parse(storedUser);
            isAuthenticated.value = true;
        } else {
            user.value = null;
            isAuthenticated.value = false;
        }
    }

    /**
     * Vérifie l'état d'authentification
     */
    function checkAuth() {
        const token = localStorage.getItem('access_token');
        if (token) {
            loadUserFromLocalStorage();
        } else {
            isAuthenticated.value = false;
        }
    }

    /**
     * Efface les messages d'erreur
     */
    function clearError() {
        errorMessage.value = null;
        validationErrors.value = {};
    }

    /**
     * Efface les messages de succès
     */
    function clearSuccess() {
        successMessage.value = null;
    }

    /**
     * Met à jour le statut d'abonnement
     * @param isSubscribed 
     */
    async function updateSubscriptionStatus(isSubscribed: boolean) {
        try {
            const token = localStorage.getItem('access_token');
            await axios.post('/user/subscription', { isSubscribed }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if (user.value) {
                user.value.subscribedNotifications = isSubscribed;
                console.log('User updated:', user.value);
                localStorage.setItem('user', JSON.stringify(user.value));
            }
        } catch (error) {
            console.error('Failed to update subscription:', error);
        }
    }

    return { isAuthenticated, user, errorMessage, validationErrors, successMessage, login, register, updateUser, forgotPassword, resetPassword, logout, checkAuth, clearError, clearSuccess, fetchUser, loadUserFromLocalStorage, updateSubscriptionStatus };
});

