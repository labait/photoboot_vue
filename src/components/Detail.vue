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
const data = ref(null)

const getResult = inject('getResult')

const loadData = async () => {
  //config.value.isLoading = true
  const docRef = doc(db, 'items', docId.value)
  const docData = await getDoc(docRef)
  data.value = docData.data()
  console.log(data.value)
  await getResult(docId.value)

  const original = document.querySelector('.original')
  const processed = document.querySelector('.processed')
  // original.style.display = 'block'
  // processed.style.display = 'none'
  config.value.isLoading = false
}


const config = inject('config')

onMounted(async () => {
  await loadData()
})

</script>

<template>
  
  <div>
    <Header :title="docId" />
    <div v-if="data" class="polaroids">
        <Polaroid class="original mb-8">
          <img :src="data.image_source" class="w-full h-full object-cover block" />
        </Polaroid>
        <Polaroid class="processed mb-8">
          <img v-if="data.image_processed" :src="data.image_processed" class="w-full h-full object-cover block" />
          <div v-else class="processing absolute p-10 top-0 left-0 w-full h-full flex flex-col items-center justify-center  text-white ">
            <p class="text-center font-bold text-xl">
              Elaborazione in corso
            </p>
            fai refresh o attendi qualche secondo...
          </div>
        </Polaroid>
    </div>
    <Debug :data="data" v-if="config.debug" />
  </div>
</template>


<style scoped lang="scss">

.polaroids {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  
  .original, .processed {
    //display: none;
  }
}


@media (min-width: 768px) {
  .main-header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 10;
  }

  .polaroids {
    margin-top: 200px;
    flex-direction: row;
    .original {
      transform: translate(-10%, 50%) scale(0.7) rotate(-10deg);
      z-index: 1;
    }

    .processed {
      transform: translateX(-20%) scale(1.5) rotate(5deg);
    }
  } 
}



</style>