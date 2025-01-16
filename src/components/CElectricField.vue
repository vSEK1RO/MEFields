<script setup lang="ts">
import { inject, watch, ref } from 'vue';
import { CSwitch, CCameraBox } from '.';
import { KEY_APP } from '../App.vue';
import { IFieldWorker } from '../workers';
import { createElectricVector } from '../model';
import { useCameraBox } from './CCameraBox.vue';
import { gridPositions } from '../utils/gridPositions';
import { calcElectricField } from '../workers/electricField';

const ctx = inject(KEY_APP)!

const active = ref(false)
const { camera_box } = useCameraBox(ctx)

function computeField() {
  if (ctx.workerEnabled.value) {
    const worker = new Worker(new URL('../workers/electricField.ts', import.meta.url), { type: 'module' });
    worker.onmessage = (event: MessageEvent<IFieldWorker.Response>) => {
      if (event.data.status === 'LOADED') {
        if (!active.value) return
        removeField()
        const vectors: IFieldWorker.Response.Vectors = JSON.parse(event.data.vectors_json)
        vectors.forEach(vector => {
          const vec = createElectricVector(vector.dir, vector.pos)
          ctx.electric.push(vec)
          ctx.scene.add(vec)
        })
      }
    }
    worker.postMessage({
      objs_json: JSON.stringify(ctx.objects.value),
      camera_box_json: JSON.stringify(camera_box.value),
    } as IFieldWorker.Request)
  } else {
    const vectors = gridPositions(camera_box.value).map(pos => {
      const vec = calcElectricField(pos, ctx.objects.value)
      return createElectricVector(vec.dir, vec.pos)
    })
    removeField()
    vectors.forEach(vec => {
      ctx.electric.push(vec)
      ctx.scene.add(vec)
    })
  }
}

function removeField() {
  ctx.electric.forEach(obj => {
    ctx.scene.remove(obj)
  })
  ctx.electric = []
}

function onActive() {
  active.value = true
  computeField()
}

function onInactive() {
  active.value = false
  removeField()
}

watch([camera_box, ctx.objects], () => {
  if (active.value) computeField()
})


</script>

<template>
  <div>
    <c-switch
      @active="onActive"
      @inactive="onInactive"
      :disabled="!ctx.loadedName.value"
    >
      <div class="flex f-gap-xs">
        <span> Show electric field </span>
      </div>
    </c-switch>
    <c-camera-box @change="camera_box = $event" />
  </div>
</template>