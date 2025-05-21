<script setup>
import { ref,defineProps } from 'vue';

const props = defineProps({
    image: {
        type: String,
        required: true
    }
})
</script>

<template>
    <div class="polaroid">
       <div class="polaroid-inner">
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
        background-color: red;
        overflow: hidden;
        position: relative;
    }   
}
</style>
