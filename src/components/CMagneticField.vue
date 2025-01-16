<script setup lang="ts">
import { inject, watch, ref } from 'vue';
import { CSwitch, CCameraBox } from '.';
import { KEY_APP } from '../App.vue';
import { IFieldWorker } from '../workers';
import { createMagneticVector } from '../model';
import { useCameraBox } from './CCameraBox.vue';
import { gridPositions } from '../utils/gridPositions';
import { calcMagneticField } from '../workers/magneticField';

const ctx = inject(KEY_APP)!

const active = ref(false)
const { camera_box } = useCameraBox(ctx)

function computeField() {
  if (ctx.workerEnabled.value) {
    const worker = new Worker(new URL('../workers/magneticField.ts', import.meta.url), { type: 'module' });
    worker.onmessage = (event: MessageEvent<IFieldWorker.Response>) => {
      if (event.data.status === 'LOADED') {
        if (!active.value) return
        removeField()
        const vectors: IFieldWorker.Response.Vectors = JSON.parse(event.data.vectors_json)
        vectors.forEach(vector => {
          const vec = createMagneticVector(vector.dir, vector.pos)
          ctx.magnetic.push(vec)
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
      const vec = calcMagneticField(pos, ctx.objects.value)
      return createMagneticVector(vec.dir, vec.pos)
    })
    removeField()
    vectors.forEach(vec => {
      ctx.magnetic.push(vec)
      ctx.scene.add(vec)
    })
  }
}

function removeField() {
  ctx.magnetic.forEach(obj => {
    ctx.scene.remove(obj)
  })
  ctx.magnetic = []
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
        <span> Show magnetic field </span>
      </div>
    </c-switch>
    <c-camera-box @change="camera_box = $event" />
  </div>
</template>