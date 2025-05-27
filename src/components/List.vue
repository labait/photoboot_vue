<script setup>
import { ref, onMounted } from 'vue'
import Polaroid from './Polaroid.vue'

const items = ref([])

onMounted(async () => {
    const response = await fetch('/.netlify/functions/list')
    const data = await response.json()
    // Shuffle the array using Fisher-Yates algorithm
    for (let i = data.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [data[i], data[j]] = [data[j], data[i]]
    }
    items.value = data
    
    setTimeout(() => {
        document.querySelectorAll('.polaroid').forEach((polaroid, index) => {
            const randomRotation = Math.random() * 20 - 10
            const safePadding = 200
            const stageWidth = window.innerWidth - safePadding  
            const stageHeight = window.innerHeight - safePadding
            const randomLeft = -stageWidth/2 + stageWidth * Math.random() 
            const randomTop = -stageHeight/2 + stageHeight * Math.random()
            polaroid.style.transform = `translate(${randomLeft}px, ${randomTop}px) rotate(${randomRotation}deg)`;
        })
    }, 0)
    
})

</script>


<template>
    <div class="flex items-center justify-center">
        <Polaroid v-for="item in items" :key="item.id" class="polaroid" >
            <img :src="item.image_source" class="w-full h-full object-cover block" />
        </Polaroid>
    </div>
</template>

<style scoped>
.polaroid {
    position: absolute;
    transition: transform 0.3s ease;
    cursor: pointer;
    &:hover {
        transform: scale(1.1);
        z-index: 10;
    }
}
</style>