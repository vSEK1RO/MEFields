<script lang="ts">
import { LoadModelRequest, LoadModelResponse } from '../workers/loadModel';
import { KEY_APP } from '../App.vue';
import { inject, onMounted, ref } from 'vue';
import { ElMessage } from 'element-plus';
import * as THREE from 'three'
import { createCharge, createWire, getCharges, getWires, IObject } from '../model';

export function importFile(callback: (file: File) => void) {
    const elem = window.document.createElement('input');
    elem.type = 'file';
    elem.classList.add('hidden')
    document.body.appendChild(elem);
    elem.onchange = () => {
        let res = elem.files?.[0]
        if (res) {
          callback(res)
        }
        document.body.removeChild(elem)
    }
    elem.oncancel = () => {
        document.body.removeChild(elem)
    }
    elem.click();
}
</script>

<script setup lang="ts">

const ctx = inject(KEY_APP)!
const loading = ref(false)

function loadModel(file: File) {
  const worker = new Worker(new URL('../workers/loadModel.ts', import.meta.url), { type: 'module' });
  worker.onmessage = (event: MessageEvent<LoadModelResponse>) => {
    switch (event.data.status) {
      case 'LOADED':
        loading.value = false
        ctx.loadedName.value = file.name
        const loader = new THREE.ObjectLoader()
        createSceneObjects(loader.parse(event.data.scene_json))
        return
      case 'LOADING':
        loading.value = true
        return
      case 'ERROR':
        loading.value = false
        ElMessage.error({ message: 'Only .gltf or .glb are supported' })
        return
    }
  }
  worker.postMessage({ file } as LoadModelRequest)
}

function uploadModel() {
  ctx.objects.forEach(object => {
    if (object.three) {
      ctx.scene.remove(object.three)
      console.log(ctx.scene.children.length)
    }
  })
  ctx.objects = []
  ctx.loadedName.value = null
}

function createSceneObjects(objs: THREE.Object3D) {
  objs.traverse((obj: THREE.Object3D) => {
    const userData = obj.userData as IObject.UserData
    switch (userData.type) {
      case 'CHARGE':
        getCharges(obj).forEach(charge => createCharge(ctx, charge))
        break
      case 'WIRE':
        getWires(obj).forEach(wire => createWire(ctx, wire))
        break
      default:
        break
    }
  })
}

onMounted(async () => {
  loading.value = true
  const modelPath = 'MEFields.glb'
  const blob = await (await fetch(modelPath)).blob()
  const file = new File([blob], modelPath, { type: blob.type })
  loadModel(file)
})
</script>

<template>
  <div>
    <el-button class="prose-btn!" v-if="!ctx.loadedName.value" :loading @click="importFile(loadModel)">
      <div class="flex f-gap-xs">
        <span> Import .glb </span>
        <div class="i-material-symbols:download w-1em h-1em" />
      </div>
    </el-button>
    <div v-else class="prose-caption-2 flex f-gap-sm items-center">
      <el-button class="prose-btn!" type="danger" @click="uploadModel" >
        <div class="flex f-gap-xs">
          <span> Unload model </span>
          <div class="i-material-symbols:close-rounded w-1em h-1em" />
        </div>
      </el-button>
      {{ ctx.loadedName }}
    </div>
  </div>
</template>