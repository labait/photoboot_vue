<script setup>
import { ref, onMounted, inject } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

import posters from '../../public/posters/posters.json'
//randomize posters
posters.sort(() => Math.random() - 0.5)

const global = inject('global')
</script>

<template>
  {{ global }}
  <div class="posters-container container mx-auto max-w-7xl">
    <h1>Posters</h1>
    <div class="posters grid grid-cols-1 md:grid-cols-4 lg:grid-cols-8 gap-4">
      <a 
        class="poster cursor-pointer bg-white rounded-lg p-4 flex flex-col items-center justify-center" 
        v-for="poster in posters" :key="poster.name"
        @click="() => {
          global.poster = poster;
          router.push('/cam');
        }"
      > 
        <div class="title text-xl font-bold mb-2">{{ poster.name }}</div>
        <img :src="`/posters/${poster.file_path}`" :alt="poster.name" class="w-full h-full object-cover" />
      </a>
    </div>
  </div>
</template>

<style scoped>

</style>