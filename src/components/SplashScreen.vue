<script setup>
import polaroid from './polaroid.vue';
</script>

<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600">
    <img src="../../images/logo_laba.svg" alt="Logo" class="w-48 mb-8">
    <h1 class="text-5xl font-bold text-white mb-8">Benvenut*</h1>
    <polaroid :image="image" class="mb-8" />
    <div class="flex space-x-4">
      <router-link to="/test" class="px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors">
        Test Component
      </router-link>
    </div>
  </div>
</template>
