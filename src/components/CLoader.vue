<script lang="ts">
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
import LoadModel from '../workers/loadModel?worker'
import { LoadModelRequest, LoadModelResponse } from '../workers/loadModel';
import { KEY_APP } from '../App.vue';
import { inject, ref } from 'vue';
import { ElMessage } from 'element-plus';
import * as THREE from 'three'
import { ObjectUserData } from '../three/types';
import { createCharge, getCharges } from '../three/charge';

const ctx = inject(KEY_APP)
const loading = ref(false)

function loadModel(file: File) {
  const worker = new LoadModel()
  worker.onmessage = (event: MessageEvent<LoadModelResponse>) => {
    switch (event.data.status) {
      case 'LOADED':
        loading.value = false
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

function createSceneObjects(objs: THREE.Object3D) {
  const group = new THREE.Group()
  objs.traverse((obj: THREE.Object3D) => {
    const userData = obj.userData as ObjectUserData
    switch (userData.type) {
      case 'CHARGE':
        getCharges(obj).map(charge => group.add(createCharge(charge)))
    }
  })
  ctx?.scene.add(group)
}
</script>

<template>
  <el-button :loading @click="importFile(loadModel)">
    Import
  </el-button>
</template>