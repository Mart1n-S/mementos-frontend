<script setup lang="ts">
import HeroSection from '@/components/HeroSection.vue';
import FeatureSection from '@/components/FeatureSection.vue';
import FooterComponent from '@/components/FooterComponent.vue'; 
</script>

<template>
  <main>
    <section class="sm:ml-64 custom-gradient md:p-4">
      <div class="mt-14">
        <HeroSection />
        <FeatureSection />
      </div>
    </section>
  </main>
  <FooterComponent />
</template>

<style>
.custom-gradient {
  background-image: linear-gradient(0deg,
      #212426 0%,
      #34383A 58%,
      #616567 100%);
}
</style>