<script setup>
import { ref, inject, defineProps } from 'vue';
import QrcodeVue, { QrcodeCanvas, QrcodeSvg } from 'qrcode.vue'
import { RouterLink } from 'vue-router';

defineProps({
    url: { 
        type: String,
    }
})

</script>

<template>
    <div class="polaroid">
       <div class="polaroid-inner">
            <RouterLink v-if="url" :to="url" class="qrcode block">
                <qrcode-vue :value="url" :size="100" level="H" />
            </RouterLink>
            <slot /> 
       </div>
    </div>
</template>

<style scoped>
.polaroid {
    --polaroid-width: 420px;
    --polaroid-height: 380px;
    --polaroid-padding: 20px;
}
.polaroid {
    width: var(--polaroid-width);
    height: var(--polaroid-height);
    background-color: #fff;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    .polaroid-inner {
        margin: var(--polaroid-padding);
        width: calc(var(--polaroid-width) - var(--polaroid-padding) * 2);
        height: calc(var(--polaroid-height) - var(--polaroid-padding) * 4);
        background-color: #999;
        overflow: hidden;
        position: relative;
    }   
    .qrcode {
        position: absolute;
        bottom: -5px;
        right: -5px;
        transition: opacity 0.3s ease;
        z-index: 1000;
        border: 5px solid white;
        &:hover {
            opacity: 0.8;
        }
    }
}
</style>
