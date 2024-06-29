<script setup lang="ts">
import HeroSection from '@/components/HeroSection.vue';
import FeatureSection from '@/components/FeatureSection.vue';
import FooterComponent from '@/components/FooterComponent.vue'; 
</script>

<template>
  <main>
    <section class="p-4 sm:ml-64">
      <div class="mt-14">
        <HeroSection />
        <FeatureSection />
      </div>
    </section>
  </main>
  <FooterComponent />
</template>
