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
  const docRef = doc(db, 'items', docId.value)
  const docData = await getDoc(docRef)
  data.value = docData.data()
  console.log(data.value)
  await getResult(docId.value)
}


const config = inject('config')

onMounted(async () => {
  await loadData()
})

</script>

<template>
  
  <div>
    <Header :title="docId" />
    <div v-if="data" class="flex flex-col items-center">
      <Polaroid>
        <img :src="data.image_source" class="w-full h-full object-cover block" />
      </Polaroid>
    </div>
    <Debug :data="data" v-if="config.debug" />
  </div>
</template>


<style scoped>

</style>