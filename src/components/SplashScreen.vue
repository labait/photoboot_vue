<script setup>
import polaroid from './Polaroid.vue';
</script>

<template>
  <img src="../../images/logo_laba.svg" alt="Logo" class="w-48 mb-8">
  <h1 class="text-5xl font-bold text-white mb-8">Benvenut*</h1>
  <polaroid :image="image" class="mb-8" />
  <div class="flex space-x-4">

    <router-link to="/list" class="px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors">
      List Component
    </router-link>
  </div>
</template>
