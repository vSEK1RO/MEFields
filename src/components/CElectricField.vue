<script setup lang="ts">
import { inject, watch, ref } from 'vue';
import { CSwitch, CCameraBox } from '.';
import { KEY_APP } from '../App.vue';
import { IElectricFieldWorker } from '../workers';
import { createElectricVector } from '../model';
import { useCameraBox } from './CCameraBox.vue';

const ctx = inject(KEY_APP)!

const active = ref(false)
const { camera_box } = useCameraBox()

function computeField() {
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
  worker.postMessage({
    objs_json: JSON.stringify(ctx.objects.value),
    ...camera_box.value,
  } as IElectricFieldWorker.Request)
}

function removeField() {
  ctx.electric.forEach(obj => {
    ctx.scene.remove(obj)
  })
  ctx.electric = []
}

watch([camera_box, ctx.objects], () => {
  if (active.value) computeField()
})
</script>

<template>
  <div>
    <c-switch
      :active="true"
      :inactive="false"
      @active="active = $event!; computeField()"
      @inactive="active = $event!; removeField()"
      :disabled="!ctx.loadedName.value"
    >
      <div class="flex f-gap-xs">
        <span> Show electric field </span>
      </div>
    </c-switch>
    <c-camera-box @change="camera_box = $event" />
  </div>
</template>