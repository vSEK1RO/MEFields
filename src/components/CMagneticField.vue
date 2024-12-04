<script setup lang="ts">
import { inject, watch, ref } from 'vue';
import { CSwitch, CCameraBox } from '.';
import { KEY_APP } from '../App.vue';
import { createMagneticVector } from '../model';
import { useCameraBox } from './CCameraBox.vue';
import { gridPositions } from '../utils/gridPositions';
import { calcMagneticField } from '../workers/magneticField';

const ctx = inject(KEY_APP)!

const active = ref(false)
const { camera_box } = useCameraBox(ctx)

function computeField() {
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