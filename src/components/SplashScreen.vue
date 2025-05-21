<script setup>
import polaroid from './Polaroid.vue';
import Header from './Header.vue';
</script>

<template>
  <Header title="Benvenut*" />
  <polaroid class="mb-8">
    
  </polaroid>
  <div class="flex space-x-4">
    <router-link to="/cam" class="px-6 py-3 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition-colors">
      Accendiamo la camera!
    </router-link>
  </div>
</template>
