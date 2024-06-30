<script setup lang="ts">
import { useRouter } from 'vue-router';
import FooterComponent from '@/components/FooterComponent.vue';

// Utilisation du router pour la navigation
const router = useRouter();

// Fonction de retour
const goBack = () => {
    router.back();
};
</script>

<template>
    <main>
        <section class="sm:ml-64 custom-gradient md:p-4">
            <div class="mt-14">
                <div class="flex flex-col items-center justify-center pt-10 text-center text-white">
                    <div class="p-4">
                        <!-- Bouton de retour -->
                        <div class="w-full mb-4 text-left">
                            <button @click="goBack" class="text-white hover:text-gray-300">
                                <svg width="35" height="35" fill="none" stroke="#ffffff" stroke-linecap="round"
                                    stroke-linejoin="round" stroke-width="3" viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.9 12h18"></path>
                                    <path d="m8.9 18-6-6 6-6"></path>
                                </svg>
                            </button>
                        </div>
                        <h1 class="mb-4 text-[50px] font-bold">Politique de Confidentialité</h1>
                        <p class="mb-4">
                            Bienvenue sur Mementos. Cette politique de confidentialité décrit comment nous collectons,
                            utilisons et protégeons vos informations personnelles lorsque vous utilisez notre site web.
                            En accédant à ce site, vous acceptez les pratiques décrites dans cette politique.
                        </p>
                    </div>

                    <div class="py-10 bg-white features-section rounded-t-3xl">
                        <div class="container min-h-screen px-4 mx-auto text-center text-black sm:px-6">
                            <h2 class="mb-4 text-2xl font-bold">1. Collecte des Informations</h2>
                            <p class="mb-9">
                                Nous collectons des informations lorsque vous vous inscrivez sur notre site, vous vous
                                connectez à votre compte et/ou lorsque vous vous déconnectez. Les informations
                                recueillies
                                incluent votre pseudo et votre adresse e-mail.
                            </p>
                            <h2 class="mb-4 text-2xl font-bold">2. Utilisation des Informations</h2>
                            <p class="mb-9">
                                Toute information que nous recueillons auprès de vous peut être utilisée pour :
                            <ul class="text-left list-disc list-inside">
                                <li>Personnaliser votre expérience et répondre à vos besoins individuels</li>
                                <li>Améliorer notre site web</li>
                                <li>Vous contacter par e-mail</li>
                            </ul>
                            </p>
                            <h2 class="mb-4 text-2xl font-bold">3. Confidentialité</h2>
                            <p class="mb-9">
                                Nous sommes les seuls propriétaires des informations recueillies sur ce site. Vos
                                informations personnelles ne
                                seront pas vendues, échangées, transférées, ou données à une autre société pour
                                n'importe quelle raison.
                            </p>
                            <h2 class="mb-4 text-2xl font-bold">4. Divulgation à des Tiers</h2>
                            <p class="mb-9">
                                Nous ne vendons, n'échangeons et ne transférons pas vos informations personnelles
                                identifiables à des tiers. Cela
                                ne comprend pas les tierce parties de confiance qui nous aident à exploiter notre site
                                Web ou à mener nos affaires,
                                tant que ces parties conviennent de garder ces informations confidentielles.
                            </p>
                            <h2 class="mb-4 text-2xl font-bold">5. Protection des Informations</h2>
                            <p class="mb-9">
                                Nous mettons en œuvre une variété de mesures de sécurité pour préserver la sécurité de
                                vos informations
                                personnelles. Nous utilisons un cryptage à la pointe de la technologie pour protéger les
                                informations sensibles
                                transmises en ligne. Nous protégeons également vos informations hors ligne. Seuls les
                                employés qui ont besoin
                                d'effectuer un travail spécifique ont
                                accès aux informations
                                personnelles identifiables. Les ordinateurs et serveurs utilisés pour stocker des
                                informations personnelles
                                identifiables sont conservés dans un environnement sécurisé.
                            </p>
                            <h2 class="mb-4 text-2xl font-bold">6. Consentement</h2>
                            <p>
                                En utilisant notre site, vous consentez à notre politique de confidentialité.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>
    <FooterComponent />
</template>
