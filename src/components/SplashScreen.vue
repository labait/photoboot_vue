<script setup>
import polaroid from './Polaroid.vue';
import Header from './Header.vue';
import { ref, inject } from 'vue';

const config = inject('config');
</script>

<template>
  <Header title="Benvenut*" />
  <polaroid class="mb-8 relative z-20">
    <img src="../assets/gif_one.gif" class="w-full h-full object-cover block">
  </polaroid>
  <div class="flex space-x-4 relative z-20">
    <router-link v-if="config.features.camera" to="/cam" class="btn-primary">
      Accendiamo la camera!
    </router-link>
    <router-link v-if="config.features.list" to="/list" class="btn-primary">
      Vai alla raccolta
    </router-link>
  </div>
</template>
