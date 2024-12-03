<script lang="ts">
export function useCameraBox() {
  return {
    camera_box: ref<ICameraBox>()
  }
}
</script>

<script setup lang="ts">
import { inject, onMounted, ref, watch } from 'vue';
import { KEY_APP } from '../App.vue';
import { cameraBox, ICameraBox } from '../utils/gridPositions';

const ctx = inject(KEY_APP)!
const last_camera_box = ref<ICameraBox>()

const emit = defineEmits<{
  (e: 'change', event: ICameraBox): void
}>()

watch(ctx.camera_pos, () => {
  const camera_box = cameraBox(ctx)
  let key: keyof ICameraBox
  let compute = false

  for (key in camera_box) {
    if (camera_box[key] !== last_camera_box.value?.[key]) {
      compute = true
    }
  }

  if (compute) {
    emit('change', camera_box)
    last_camera_box.value = camera_box
  }
})

onMounted(() => {
  const camera_box = cameraBox(ctx)
  emit('change', camera_box)
  last_camera_box.value = camera_box
})
</script>

<template>
  <div></div>
</template>