<script lang="ts">
import type { InjectionKey } from 'vue'
import * as THREE from 'three'
import { provide, onMounted } from 'vue'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import { CLoader } from './components'

export const KEY_APP: InjectionKey<AppContext> = Symbol('app')
export interface AppContext {
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  controls: OrbitControls
  renderer: THREE.WebGLRenderer
}
</script>

<script setup lang="ts">
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)

const scene = new THREE.Scene()
scene.background = new THREE.Color(0xFFFFFF)

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.x = 10
camera.position.y = 10
camera.position.z = 10

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.05
controls.enableZoom = true
controls.autoRotate = true
controls.autoRotateSpeed = 0

provide(KEY_APP, {
  scene,
  camera,
  controls,
  renderer,
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
  <div class="font-sans">
    <c-loader/>
    <div id="renderer"/>
  </div>
</template>

<style>
</style>