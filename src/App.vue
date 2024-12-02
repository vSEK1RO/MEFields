<script lang="ts">
import type { InjectionKey, Ref } from 'vue'
import * as THREE from 'three'
import { provide, onMounted, ref } from 'vue'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import { CLoader, CElectricField, CMagneticField } from './components'
import { IObject } from './model'

export const KEY_APP: InjectionKey<IAppContext> = Symbol('app')
export interface IAppContext {
  scene: THREE.Scene
  objects: IObject[]
  loadedName: Ref<string | null>
}
</script>

<script setup lang="ts">
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)

const scene = new THREE.Scene()
scene.background = new THREE.Color(0xFFFFFF)

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(5, 5, 5)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.05
controls.enableZoom = true
controls.autoRotate = true
controls.autoRotateSpeed = 0

provide(KEY_APP, {
  scene,
  objects: [],
  loadedName: ref(null),
})

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
    </div>
  </div>
</template>

<style>
</style>