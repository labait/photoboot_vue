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
    <router-link to="/" class="main-header text-white flex items-center justify-between z-10 mt-8 mb-8 px-8">
        <div class="flex items-center">
            <img src="../assets/header-logo.png" alt="Loghi" class="w-800">
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