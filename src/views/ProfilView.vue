<script setup lang="ts">
import CardProfil from '@/components/CardProfil.vue';
import FooterComponent from '@/components/FooterComponent.vue';
import BackButton from '@/components/BackButton.vue';
</script>

<template>
    <main>
        <section class="sm:ml-64 custom-gradient md:p-4">
            <div class="mt-14">
                <div class="flex flex-col items-center justify-center p-4 py-10 text-center text-white">
                    <BackButton />
                    <h1 class="mb-4 text-[50px] font-bold">PROFIL</h1>
                </div>

                <CardProfil />
            </div>
        </section>
    </main>
    <FooterComponent />
</template>

<style></style>