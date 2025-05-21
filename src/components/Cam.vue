<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue';

const video = ref(null);
const canvas = ref(null);
const image = ref(null);
const videoDevices = ref([]);
const selectedDevice = ref('');
const isUploading = ref(false);

// Get the current instance to access the global saveImageFrom function
const { proxy } = getCurrentInstance();

onMounted(async () => {
  await getVideoDevices();
  if (videoDevices.value.length > 0) {
    selectedDevice.value = videoDevices.value[0].deviceId;
    await startCamera();
  }
});

async function getVideoDevices() {
  try {
    const permission = await navigator.mediaDevices.getUserMedia({ video: true });
    const devices = await navigator.mediaDevices.enumerateDevices();
    videoDevices.value = devices.filter(device => device.kind === 'videoinput');
    console.log(videoDevices.value);
  } catch (error) {
    console.error('Error getting video devices:', error);
  }
}

async function startCamera() {
  if (!selectedDevice.value) return;
  
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        deviceId: selectedDevice.value ? { exact: selectedDevice.value } : undefined
      }
    });
    
    if (video.value) {
      video.value.srcObject = stream;
      video.value.play();
    }
  } catch (error) {
    console.error('Error accessing camera:', error);
  }
}

async function changeCamera() {
  if (video.value && video.value.srcObject) {
    const tracks = video.value.srcObject.getTracks();
    tracks.forEach(track => track.stop());
  }
  
  await startCamera();
}

async function shot() {
  if (!video.value) return;
  
  // Create canvas if it doesn't exist
  if (!canvas.value) {
    canvas.value = document.createElement('canvas');
  }
  
  // Set canvas dimensions to match video
  canvas.value.width = video.value.videoWidth;
  canvas.value.height = video.value.videoHeight;
  
  // Draw current video frame to canvas
  const ctx = canvas.value.getContext('2d');
  ctx.drawImage(video.value, 0, 0, canvas.value.width, canvas.value.height);
  
  // Get image as data URL
  image.value = canvas.value.toDataURL('image/png');
  
  // Download a local copy
  const link = document.createElement('a');
  link.download = 'photo.png';
  link.href = image.value;
  link.click();
  
  // Use the global saveImageFrom function
  try {
    isUploading.value = true;
    
    // Call the globally registered saveImageFrom function
    const result = await proxy.saveImageFrom(image.value);
    
    if (result.success) {
      console.log('Image processed successfully with result:', result);
    } else {
      console.error('Error processing image:', result.error);
    }
    
    isUploading.value = false;
  } catch (error) {
    console.error('Error processing image:', error);
    isUploading.value = false;
  }
}
</script>

<template>
  <img src="../../public/images/logo_laba.svg" alt="Logo" class="w-48 mb-8">
  <h1 class="text-5xl font-bold text-white mb-8">Mettiti in posa</h1>
  <polaroid v-if="image" :image="image" class="mb-8" />


    <video ref="video" class="cam object-cover"></video>

  
  <select v-model="selectedDevice" @change="changeCamera" class="mt-2 p-2 rounded">
    <option v-for="device in videoDevices" :key="device.deviceId" :value="device.deviceId">
      {{ device.label || `Camera ${videoDevices.indexOf(device) + 1}` }}
    </option>
  </select>

  <button class="btn-primary mt-4" @click="shot" :disabled="isUploading">
    {{ isUploading ? 'Caricamento...' : 'Scatta' }}
  </button>
</template>


<style scoped>
.cam {
    border: 1px solid red;
    min-width: 300px;
    min-height: 300px;
    max-width: 800px;
    max-height: 800px;
    object-fit: cover;
}
</style>