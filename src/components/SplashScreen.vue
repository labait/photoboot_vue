<script setup>
import polaroid from './Polaroid.vue';
import Header from './Header.vue';
import { ref, inject } from 'vue';

const global = inject('global');
</script>

<template>
  <div class="px-4 sm:px-8 md:px-16 min-h-screen flex flex-col justify-center">
    <Header title="Benvenut*" />
    <div>
      <p class="text-white font-bold text-2xl sm:text-3xl md:text-4xl lg:text-6xl mb-6 md:mb-8">
        LABA's photobooth
      </p>
      <div class="flex flex-col sm:flex-row items-center gap-4 mb-6 md:mb-8">
        <img src="../assets/txt.svg" class="w-full sm:w-1/2 h-auto object-cover block">
        <img src="../assets/polaroid.svg" class="w-full sm:w-1/2 h-auto object-cover block w-[0.8]">
      </div>
    </div>
    <div class="flex relative z-20 items-center justify-start">
      <router-link
        v-if="global.features.camera"
        to="/cam"
        class="btn-primary rounded-full bg-[#FF7230] text-white w-fit px-6 py-3 text-sm sm:text-base"
      >
        Scopri l'esperienza
      </router-link>
    </div>
  </div>
</template>