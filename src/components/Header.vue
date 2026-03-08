<script setup>
import Auth from './Auth.vue'

defineProps({
    title: {
        type: String,
        required: false,
        default: ''
    }
})
</script>

<template>
    <div class="relative grid grid-cols-2 md:grid-cols-3 w-full py-12 md:pt-4 md:pb-0">
        <div class="flex justify-start md:justify-start">
            <router-link to="/" class="main-header text-white flex items-center">
                <div class="flex items-center">
                    <img src="../assets/logo-laba.svg" alt="Loghi" class="mb-4 w-30 sm:w-36 md:w-40 lg:w-48">
                </div>
            </router-link>
        </div>
        <div class="flex justify-end md:justify-center">
            <router-link to="/" class="main-header text-white flex items-center">
                <div class="flex items-center">
                    <img src="../assets/logo-sfa.svg" alt="Loghi" class="mb-4 w-20 md:w-28 lg:w-30">
                </div>
            </router-link>
        </div>
        <div class="flex justify-start md:justify-end">
            <Auth />
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