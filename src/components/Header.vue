<script setup>
import { ref } from 'vue';

defineProps({
    title: {
        type: String,
        required: true,
        default: 'Benvenut*'
    }
})
</script>

<template>
    <router-link to="/" class="main-header text-white mb-8 flex items-center justify-center z-10 mt-8">
        <div class="flex flex-col items-center">
            <img src="../assets/logo_laba.svg" alt="Logo" class="w-48 mb-8">
            <h1 class="text-5xl font-bold">{{ title }}</h1>
        </div>
    </router-link>
</template>

<style scoped>

</style>