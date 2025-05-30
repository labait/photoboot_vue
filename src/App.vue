<script setup>
import { ref, provide } from 'vue';

import { storage, db } from './firebase'
import { ref as storageRef, uploadString, uploadBytes, getDownloadURL } from 'firebase/storage'
import { collection, addDoc, serverTimestamp, updateDoc, doc, getDoc } from 'firebase/firestore'

import Footer from './components/Footer.vue'
import Loading from './components/Loading.vue'

const config = ref({
  countDownSeconds: 3,
  debug: false,
  isLoading: false,
  currentImage: null,
  docData: null,
  features: {
    'list': true,
    'camera': false,
  },
})
window.config = config; // for debug purposes


const getStorageUrl = async (str) => {
  const url = str.split('\/o\/')[1].split("?")[0].replaceAll("%2F", "/")
  const imageRef = storageRef(storage, url)
  const storageUrl = await getDownloadURL(imageRef)
  console.log(storageUrl)
  return storageUrl
}

const uploadImage = async (imageDataUrl, imageId) => {
  try {
    config.value.isLoading = true;

    const docRef = await addDoc(collection(db, 'items'), {
      timestamp: serverTimestamp(),
      image_id: imageId,
      status: 'created',
    })

    const imageRef = storageRef(storage, `images/${imageId}/${imageId}.png`)
    await uploadString(imageRef, imageDataUrl, 'data_url')
    config.value.currentImage = imageDataUrl;
    const downloadURL = await getDownloadURL(imageRef)
    await updateDoc(docRef, {
      image_source: downloadURL,
    })
    
    const docData = (await getDoc(docRef)).data();
    config.value.docData = docData;
    config.value.docId = docRef.id;
    console.log('docData',config.value)

    // call process function
    const processUrl = `/.netlify/functions/processImage?docId=${docRef.id}`;
    console.log('processUrl', processUrl);
    const response = await fetch(processUrl);
    const result = await response.json()

    // update the status to processing
    await updateDoc(docRef, {
      status: 'processing',
    })

    return true;

  } catch (error) {
    console.error('Error uploading image:', error)
    return false;
  }
}


const getResult = async (docId) => {
  const maxChecks = 30;
  const docRef = doc(db, 'items', docId)
  const docData = await getDoc(docRef)
  let checkCount = docData.check_count || 0;  
  
  // call process function
  const getImageProcessedUrl = `/.netlify/functions/getImageProcessed?docId=${docId}`;
  console.log(`getImageProcessedUrl ${docId}, checkCount ${checkCount}`, getImageProcessedUrl);
  const response = await fetch(getImageProcessedUrl);
  const data = await response.json()

  checkCount = checkCount + 1;
  await updateDoc(docRef, {
    check_count: checkCount,
  })

  if (data.process_result.status == "succeeded") {    
    config.value.docData = data;
    console.log('docData', data)
  } else {
    if (checkCount < maxChecks) {
      setTimeout(() => {
        getResult(docId)
      }, 5000)
    } else {
      console.log(`failed to get result after ${maxChecks} checks`)
      await updateDoc(docRef, {
        status: 'failed',
      })
    }
  }
 
  return data;
}


const detailUrl = (docId) => {
    return `${window.location.origin}/detail/${docId}`
}


provide('config', config);
provide('uploadImage', uploadImage);
provide('getResult', getResult);
provide('detailUrl', detailUrl);
provide('getStorageUrl', getStorageUrl);

</script>

<template>
  <main class="flex flex-col items-center justify-center min-h-screen">
    <Loading v-if="config.isLoading" />
    <router-view />
    <Footer />
  </main>
</template>

<style scoped>
main {
  background-image: url('/images/animazione_backdrop.gif');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}
</style>