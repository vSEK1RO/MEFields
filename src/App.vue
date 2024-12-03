<script lang="ts">
import type { InjectionKey, Ref } from 'vue'
import * as THREE from 'three'
import { provide, onMounted, ref } from 'vue'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import { CLoader, CElectricField, CMagneticField, CSwitch } from './components'
import { IObject } from './model'

export const KEY_APP: InjectionKey<IAppContext> = Symbol('app')
export interface IAppContext {
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  camera_pos: Ref<THREE.Vector3>
  objects: Ref<IObject[]>
  electric: THREE.Object3D[]
  magnetic: THREE.Object3D[]
  loadedName: Ref<string | null>
  workerEnabled: Ref<boolean>
}
</script>

<script setup lang="ts">
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)

const scene = new THREE.Scene()
scene.background = new THREE.Color(0xFFFFFF)

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(5, 5, 5)
const camera_pos = ref(camera.position.clone())

const controls = new OrbitControls(camera, renderer.domElement)
controls.addEventListener('change', () => { camera_pos.value = camera.position.clone() })
controls.enableDamping = true
controls.dampingFactor = 0.05
controls.enableZoom = true
controls.autoRotate = true
controls.autoRotateSpeed = 0

const ctx = {
  scene,
  camera,
  camera_pos,
  objects: ref([]),
  electric: [],
  magnetic: [],
  loadedName: ref(null),
  workerEnabled: ref(false),
}

provide(KEY_APP, ctx)

onMounted(() => {
  document.getElementById('renderer')?.appendChild(renderer.domElement)
  renderer.setAnimationLoop(() => {
    renderer.render(scene, camera)
    controls.update()
  })
})
</script>

<template>
  <div>
    <div id="renderer" class="absolute h-full w-full z--1 overflow-hidden"/>
    <div class="flex flex-col f-gap-xs f-p-sm w-fit">
      <c-loader/>
      <c-electric-field/>
      <c-magnetic-field/>
      <c-switch
        is-active
        @active="ctx.workerEnabled.value = true"
        @inactive="ctx.workerEnabled.value = false"
      >
        <span v-if="!ctx.workerEnabled.value"> Enable workers </span>
        <span v-else> Disable workers </span>
      </c-switch>
    </div>
  </div>
</template>

<style>
</style>