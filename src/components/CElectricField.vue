<script setup lang="ts">
import { inject, watch, ref } from 'vue';
import { CSwitch } from '.';
import { KEY_APP } from '../App.vue';
import { IElectricFieldWorker } from '../workers';
import { cameraBox, ICameraBox } from '../utils/gridPositions';
import { createElectricVector } from '../model';

const ctx = inject(KEY_APP)!

const active = ref(false)
const last_camera_box = ref<ICameraBox | undefined>(undefined)

function computeField(camera_box: ICameraBox) {
  const worker = new Worker(new URL('../workers/electricField.ts', import.meta.url), { type: 'module' });
  worker.onmessage = (event: MessageEvent<IElectricFieldWorker.Response>) => {
    if (event.data.status === 'LOADED') {
      removeField()
      const vectors: IElectricFieldWorker.Responce.Vectors = JSON.parse(event.data.vectors_json)
      vectors.forEach(vector => {
        const vec = createElectricVector(vector.dir, vector.pos)
        ctx.electric.push(vec)
        ctx.scene.add(vec)
      })
    }
  }
  last_camera_box.value = camera_box
  worker.postMessage({
    objs_json: JSON.stringify(ctx.objects),
    ...camera_box,
  } as IElectricFieldWorker.Request)
}

function removeField() {
  ctx.electric.forEach(obj => {
    ctx.scene.remove(obj)
  })
  ctx.electric = []
}

watch(ctx.camera_pos, () => {
  const camera_box = cameraBox(ctx)
  let key: keyof ICameraBox
  let compute = false

  for (key in camera_box) {
    if (camera_box[key] !== last_camera_box.value?.[key]) {
      compute = true
    }
  }
  
  if (active.value && compute) computeField(camera_box)
})
watch(ctx.objects, () => {
  if (active.value) computeField(cameraBox(ctx))
})
</script>

<template>
  <div>
    <c-switch
      :active="true"
      :inactive="false"
      @active="active = $event!"
      @inactive="active = $event!"
      :disabled="!ctx.loadedName.value"
    >
      <div class="flex f-gap-xs">
        <span> Show electric field </span>
      </div>
    </c-switch>
  </div>
</template>