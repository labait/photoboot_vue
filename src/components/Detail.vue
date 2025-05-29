<script setup>
import { ref, onMounted, inject } from 'vue'
import { useRoute } from 'vue-router'

import Header from './Header.vue'
import Polaroid from './Polaroid.vue'
import Debug from './Debug.vue'

import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'

const route = useRoute()
const docId = ref(route.params.docId)

const config = inject('config')
const getResult = inject('getResult')
const detailUrl = inject('detailUrl')
const getStorageUrl = inject('getStorageUrl')

const loadData = async () => {
  //config.value.isLoading = true
  const docRef = doc(db, 'items', docId.value)
  config.value.docData = (await getDoc(docRef)).data()
  console.log(config.value.docData)
  await getResult(docId.value)

  const original = document.querySelector('.original')
  const processed = document.querySelector('.processed')
  // original.style.display = 'block'
  // processed.style.display = 'none'

  config.value.docData.image_source = await getStorageUrl(config.value.docData.image_source)
  config.value.docData.image_processed = await getStorageUrl(config.value.docData.image_processed)

  config.value.isLoading = false
}


onMounted(async () => {
  await loadData()
})

const print = () => {
  window.print()
}

</script>

<template>
  
  <div>
    <Header :title="config.docData?.image_id" />

    <div v-if="config.docData" class="polaroids">
        <Polaroid class="original mb-8">
          <img :src="config.docData.image_source" class="w-full h-full object-cover block" />
        </Polaroid>
        <Polaroid :url="detailUrl(docId)" class="processed mb-8 active">
          <img v-if="config.docData.image_processed" :src="config.docData.image_processed" class="w-full h-full object-cover block" />
          <div v-else class="processing absolute p-10 top-0 left-0 w-full h-full flex flex-col items-center justify-center  text-white ">
            <p class="text-center font-bold text-xl">
              Elaborazione in corso
            </p>
            fai refresh o attendi qualche secondo...
          </div>
        </Polaroid>
    </div>

    <div class="btn-wrapper fixed flex justify-center bottom-0 right-0 left-0 m-10 z-10000 bg-black">
      <div class="p-4">
        <button class="btn-primary" @click="print">Stampa</button>
      </div>
    </div>
    <Debug :data="config.docData" v-if="config.debug" />
  </div>
</template>


<style scoped>

.polaroid {
  .qrcode {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}

.polaroids {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}


@media (max-width: 768px) {
  .polaroid {
    transform: scale(0.7);
  }
}


@media (min-width: 768px) {

  .polaroids {
    margin-top: 200px;
    flex-direction: row;
    .original {
      transform: translate(-10%, 50%) scale(0.7) rotate(-10deg);
      z-index: 1;
    }

    .processed {
      transform: translateX(-40%) scale(1.5) rotate(5deg);
    }
  } 
}



</style>