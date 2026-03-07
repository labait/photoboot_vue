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
    <div class="grid grid-cols-1 md:grid-cols-2 debug w-full mt-4">
        <div class="flex justify-start md:justify-start">
            <router-link to="/" class="main-header text-white flex items-center">
                <div class="flex items-center">
                    <img src="../assets/logo-laba.svg" alt="Loghi" class="mb-4 w-24 sm:w-32 md:w-40 lg:w-48">
                </div>
            </router-link>
        </div>
        <div class="flex justify-start md:justify-end">
            <router-link to="/" class="main-header text-white flex items-center">
                <div class="flex items-center">
                    <img src="../assets/logo-sfa.svg" alt="Loghi" class="mb-4 w-14 sm:w-32 md:w-28 lg:w-36">
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