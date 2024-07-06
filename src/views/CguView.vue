<script setup lang="ts">
import FooterComponent from '@/components/FooterComponent.vue';
import BackButton from '@/components/BackButton.vue';
</script>

<template>
    <main>
        <section class="sm:ml-64 custom-gradient md:p-4">
            <div class="mt-14">
                <div class="flex flex-col items-center justify-center pt-10 text-center text-white">
                    <div class="p-4">
                        <BackButton />
                        <h1 class="mb-4 text-[50px] font-bold">Conditions Générales d'Utilisation</h1>
                        <p class="mb-4">
                            Bienvenue sur Mementos. En accédant à ce site web, vous acceptez de vous conformer aux
                            présentes
                            conditions générales d'utilisation. Si vous n'acceptez pas ces termes, veuillez ne pas
                            utiliser
                            notre site.
                        </p>
                    </div>

                    <div class="py-10 bg-white features-section rounded-t-3xl">
                        <div class="container min-h-screen px-4 mx-auto text-center text-black sm:px-6">
                            <h2 class="mb-4 text-2xl font-bold">1. Utilisation du Site</h2>
                            <p class="mb-9">
                                Vous vous engagez à utiliser ce site web de manière légale et conforme aux présentes
                                conditions.
                                Toute utilisation frauduleuse ou abusive est strictement interdite.
                            </p>
                            <h2 class="mb-4 text-2xl font-bold">2. Propriété Intellectuelle</h2>
                            <p class="mb-9">
                                Tout le contenu présent sur ce site, y compris les textes, images, logos et graphiques,
                                est la
                                propriété de
                                Mementos ou de ses concédants et est protégé par les lois sur la propriété
                                intellectuelle.
                            </p>
                            <h2 class="mb-4 text-2xl font-bold">3. Limitation de Responsabilité</h2>
                            <p class="mb-9">
                                Mementos ne pourra être tenu responsable des dommages directs ou indirects résultant de
                                l'utilisation de ce
                                site web ou de l'incapacité d'utiliser ce site.
                            </p>
                            <h2 class="mb-4 text-2xl font-bold">4. Modifications des Conditions</h2>
                            <p class="mb-9">
                                Mementos se réserve le droit de modifier ces conditions à tout moment. Les modifications
                                entreront
                                en vigueur
                                dès leur publication sur ce site. Il est de votre responsabilité de consulter
                                régulièrement les
                                conditions
                                générales d'utilisation pour prendre connaissance des éventuelles modifications.
                            </p>
                            <h2 class="mb-4 text-2xl font-bold">5. Contact</h2>
                            <p>
                                Si vous avez des questions concernant ces conditions générales d'utilisation, veuillez
                                nous
                                contacter à
                                l'adresse suivante : contact@mementos.com.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </main>
    <FooterComponent />
</template>
