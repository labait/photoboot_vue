<script setup>
import { inject } from 'vue'
const config = inject('config')
</script>
<template>
  <div v-if="config.errorMessage" class="error fixed top-0 w-full bg-red-700 p-2 flex text-white items-center justify-center">
    {{ config.errorMessage }}
  </div>
</template>
