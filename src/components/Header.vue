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
    <div class="grid grid-cols-1 md:grid-cols-2 debug w-full">
        <div class="flex justify-center md:justify-start">
            <router-link to="/" class="main-header text-white flex items-center">
                <div class="flex items-center">
                    <img src="../assets/header-logo.svg" alt="Loghi" class="mb-8">
                </div>
            </router-link>
        </div>
        <div class="flex justify-center md:justify-end">
            <router-link to="/" class="main-header text-white flex items-center">
                <div class="flex items-center">
                    <img src="../assets/header-logo.svg" alt="Loghi" class="mb-8">
                </div>
            </router-link>
        </div>
    </div>
</template>

<style scoped>
.header {
    position: fixed;
    top: 0;
    z-index: 3000;
}
</style>