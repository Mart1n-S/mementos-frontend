<script setup lang="ts">
import InscriptionForm from '@/components/InscriptionForm.vue';
import FooterComponent from '@/components/FooterComponent.vue';
import BackButton from '@/components/BackButton.vue';
</script>

<template>
    <main>
        <section class="sm:ml-64 custom-gradient md:p-4">
            <div class="mt-14">
                <div class="flex flex-col items-center justify-center p-4 py-10 text-center text-white">
                    <BackButton />
                </div>
                <InscriptionForm />
            </div>
        </section>
    </main>
    <FooterComponent />
</template>

<style></style>