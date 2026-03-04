<script setup>
import polaroid from './Polaroid.vue';
import Header from './Header.vue';
import { ref, inject } from 'vue';

const config = inject('config');
</script>

<template>
  <div class="px-16">
    <Header title="Benvenut*" />

    <div>
      <p class="text-white font-bold text-6xl mb-8">LABA's photobooth</p>
      
      <div class="flex items-center gap-4 mb-8">
        <img src="../assets/txt.svg" class="w-1/2 h-auto object-cover block">
        <img src="../assets/polaroid.svg" class="w-1/2 h-auto object-cover block">
      </div>
    </div>

    <div class="flex space-x-4 relative z-20 items-center justify-start"> 
      <router-link v-if="config.features.camera" to="/cam" class="btn-primary rounded-full bg-[#FF7230] text-white w-fit">
        Scopri l'esperienza
      </router-link>
    </div>
  </div>
    <!-- <router-link v-if="config.features.list" to="/list" class="btn-primary">
      Vai alla raccolta
    </router-link>  -->

</template>
