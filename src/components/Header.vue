<script setup>
import { ref } from 'vue';

defineProps({
    title: {
        type: String,
        required: false,
        default: ''
    }
})
</script>

<template>
    <router-link to="/" class="main-header text-white flex items-center">
        <div class="flex items-center">
            <img src="../assets/header-logo.svg" alt="Loghi" class="mb-8">
        </div>
    </router-link>
</template>

<style scoped>
.header {
    position: fixed;
    top: 0;
    z-index: 3000;
}
</style>