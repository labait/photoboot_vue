<script setup>
import { ref, onMounted, inject } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

import posters from '../../src/posters.json'
//randomize posters
posters.sort(() => Math.random() - 0.5)

const global = inject('global')
</script>

<template>
  <!--{{ global }} -->
  <div class="posters-container container mx-auto max-w-7xl">
  <div class="h-35 flex items-center justify-center">
    <h1 class="text-white font-bold text-[6vw] sm:text-[2vw] py-2">Seleziona il tuo poster preferito: </h1>
    </div>

    <div class="posters grid grid-cols-5 gap-4 mb-4 ">
      
        <a class="poster cursor-pointer border bg-[#4f485f] rounded-lg p-4 flex flex-col items-center hover:bg-[#7069a2] hover:scale-103 transition-transform duration-300"
        v-for="poster in posters.slice(0, 10)" :key="poster.name"
        @click="() => {
          global.poster = poster;
          router.push('/cam');
        }"
      >
        <div class="title text-lg font-bold mb-2 text-left w-full h-16 text-white">{{ poster.name }}</div>
        <div class="w-full h-64 overflow-hidden rounded">
          <img :src="`/posters/${poster.file_path}`" :alt="poster.name" class="w-full h-full object-cover" />
        </div>
      </a>
    </div>

    </div>
  </template>

<style scoped>

</style>

<style scoped>

</style>