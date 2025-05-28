<script setup>
import { ref, onMounted, inject } from 'vue'
import Header from './Header.vue'
import Polaroid from './Polaroid.vue'

const detailUrl = inject('detailUrl')
const config = inject('config')
const getStorageUrl = inject('getStorageUrl')

const maxItems = 50
const maxRotation = 30
const safePadding = 200
const nextInterval = 20000
const items = ref([])
let nextTimeout;
let currentItem;
let currentPolaroid;
let previousPolaroid;

onMounted(async () => {
    config.value.isLoading = true
    const response = await fetch('/.netlify/functions/list')
    const data = await response.json()
    // Shuffle the array using Fisher-Yates algorithm
    for (let i = data.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [data[i], data[j]] = [data[j], data[i]]
    }
    items.value = data.slice(0, maxItems)
    

    items.value = await Promise.all(items.value.map(async item => {
        return {
            ...item,
            image_source: await getStorageUrl(item.image_source),
            image_processed: await getStorageUrl(item.image_processed)
        }
    }))
    config.value.isLoading = false
    
    // setup the polaroids
    setTimeout(() => {
        setupPolaroids()
        const item = getRandomItem()
        showPolaroid(item.docId)
    }, 0)
    
})

const getRandomItem = () => {
    const randomIndex = Math.floor(Math.random() * items.value.length)
    return items.value[randomIndex]
}

const setupPolaroids = () => {
    document.querySelectorAll('.polaroid').forEach((polaroid, index) => {
        const randomRotation = -maxRotation + Math.random() * maxRotation
        const stageWidth = window.innerWidth - safePadding  
        const stageHeight = window.innerHeight - safePadding
        const randomLeft = -stageWidth/2 + stageWidth * Math.random() 
        const randomTop = -stageHeight/2 + stageHeight * Math.random()
        const transform = `translate(${randomLeft}px, ${randomTop}px) rotate(${randomRotation}deg) scale(0.5)`
        polaroid.style.zIndex = polaroid.style.zIndex_previous = 1000+index;
        polaroid.style.transform = transform
        polaroid.style.transform_previous = transform
    })
}



const showPolaroid = (docId) => {
    console.log(docId)
    currentItem = items.value.find(item => item.docId === docId)
    currentPolaroid = document.getElementById(`item-${docId}`)
    if(!currentPolaroid || currentPolaroid === previousPolaroid) return
    hidePreviousPolaroid()
    currentPolaroid.style.transform = `translate(0, 0) rotate(0deg) scale(1.5)`
    currentPolaroid.style.zIndex = 2000
    currentPolaroid.classList.add('active')
    previousPolaroid = currentPolaroid
    clearTimeout(nextTimeout);
    nextTimeout = setTimeout(() => {
        const item = getRandomItem()
        showPolaroid(item.docId)
    }, nextInterval)
    return
}

const hidePreviousPolaroid = () => {
    if(previousPolaroid) {
        previousPolaroid.classList.remove('active')
        previousPolaroid.style.transform = previousPolaroid.style.transform_previous
        previousPolaroid.style.zIndex = previousPolaroid.style.zIndex_previous 
    }
}

const clickPolaroid = (item) => {
    if(item !== currentItem) {
        currentItem = item
        showPolaroid(item.docId)
    } else {
        previousPolaroid = document.getElementById(`item-${item.docId}`)
        hidePreviousPolaroid()
    }
}

</script>


<template>
    <Header class="header" />
    <div v-if="!config.isLoading" class="flex items-center justify-center polaroids">
        
        <Polaroid v-for="item in items" :url="detailUrl(item.docId)" :key="item.docId" :id="`item-${item.docId}`" :data-image-id="item.image_id" class="polaroid" @click="clickPolaroid(item)">
            <img :src="item.image_source" class="absolute top-0 left-0 w-full h-full object-cover block image-source" />
            <img :src="item.image_processed" class="absolute top-0 left-0 w-full h-full object-cover block image-processed" />
        </Polaroid>
    </div>
</template>

<style>
body {
    overflow: hidden;
}

.polaroid {
    .qrcode {
        display: none;
    }
    &.active {
        .qrcode {
            display: block;
        }
    }
}
</style>

<style scoped>

.polaroid {
    position: absolute;
    transition: transform 0.3s ease;
    cursor: pointer;
    box-shadow: 0 20px 20px rgba(0, 0, 0, 0.6);
}

.image-processed {
    animation: anim_processed 3s ease infinite;
}

.image-source {
    transform: scaleX(-1);
}


@keyframes anim_processed {
    0% {
        opacity: 1;
    }
    50% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}
</style>