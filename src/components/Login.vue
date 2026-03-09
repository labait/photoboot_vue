<script setup>
import Auth from './Auth.vue'
</script>

<template>
  <div class="flex justify-end w-full">
    <div class="auth-btn">
      <Auth />
    </div>
  </div>
</template>

<style scoped>
.auth-btn :deep(button) {
  padding: 8px 16px !important;
  font-size: 14px !important;
  border-radius: 6px !important;
  height: auto !important;
  width: auto !important;
}

.auth-btn :deep(div) {
  margin: 0 !important;
  padding: 0 !important;
}
</style>
