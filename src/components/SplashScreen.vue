<script setup>
import polaroid from './Polaroid.vue';
import Header from './Header.vue';
</script>

<template>
  <Header title="Benvenut*" />
  <polaroid class="mb-8">
    <img src="../assets/quadrati_interno_polaroid.gif" class="w-full h-full object-cover block">
  </polaroid>
  <div class="flex space-x-4">
    <router-link to="/cam" class="btn-primary">
      Accendiamo la camera!
    </router-link>
  </div>
</template>
