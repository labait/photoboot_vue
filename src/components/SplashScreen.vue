<script setup>
import polaroid from './Polaroid.vue';
import Header from './Header.vue';
import { ref, inject } from 'vue';

const global = inject('global');
</script>

<template>
  <div class="flex flex-col justify-start w-full">
    <div>
      <p class="text-white font-medium text-[8vw] sm:text-[4vw] py-2">
        LABA'S PHOTOBOOTH
      </p>
      <div class="flex flex-col sm:flex-row items-start gap-4 mb-6 md:mb-8">
        <img src="../assets/txt.svg" class="w-full sm:w-[50vw] h-auto object-cover block">
        <img src="../assets/polaroid.svg" class="w-full sm:w-[35vw] h-auto object-cover block">
      </div>
    </div>
    <div class="flex relative z-20 items-center justify-start">
      <router-link
        v-if="global.features.camera"
        to="/cam"
        class="btn-primary rounded-60 bg-[#FF7230] text-white w-fit px-6 py-3 text-sm sm:text-base mb-16">
        Scopri l'esperienza
      </router-link>
    </div>
  </div>
</template>