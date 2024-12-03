<script setup lang="ts">
import { inject, watch } from 'vue';
import { KEY_APP } from '../App.vue';
import { IParticle } from '../model';
import * as THREE from 'three'
import { calcElectricField } from '../workers/electricField';
import { calcMagneticField } from '../workers/magneticField';

const ctx = inject(KEY_APP)!

const TIME_SIZE = 1e3
const TIME_STEP = 1e-2

function computeTrajectory() {
  const trajectories: THREE.Object3D[]= []
  ctx.objects.value.forEach(obj => {
    if (obj.userData.type === 'PARTICLE') {
      let points: THREE.Vector3[] = []
      let particle: IParticle = JSON.parse(JSON.stringify(obj))
      particle.position = (obj as IParticle).position.clone()
      particle.direction = (obj as IParticle).direction.clone()
      for (let time = 0; time < TIME_SIZE; time++) {
        points.push(particle.position.clone())
        particle = updatePosition(particle)
      }
      points.push(particle.position.clone())
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({ color: 0x0000FF });
      const trajectory = new THREE.Line(geometry, material)

      trajectories.push(trajectory)
    }
  })
  removeTrajectory()
  ctx.scene.add(...trajectories)
  ctx.trajectory.push(...trajectories)
}

function removeTrajectory() {
  ctx.trajectory.forEach(obj => {
    ctx.scene.remove(obj)
  })
  ctx.trajectory = []
}

function updatePosition(obj: IParticle) {
  const v = obj.direction.clone().normalize().multiplyScalar(obj.userData.speed)
  const r = obj.position.clone()
  const F_electric = calcElectricField(obj.position, ctx.objects.value).dir
  const F_magnetic = new THREE.Vector3().crossVectors(v, calcMagneticField(obj.position, ctx.objects.value).dir)
  const F = new THREE.Vector3().addVectors(F_electric, F_magnetic).multiplyScalar(obj.userData.charge)

  v.addScaledVector(F, TIME_STEP / obj.userData.mass)
  r.addScaledVector(v, TIME_STEP)

  const next_obj: IParticle = JSON.parse(JSON.stringify(obj))
  next_obj.position = r
  next_obj.direction = v.clone().normalize()
  next_obj.userData.speed = v.length()
  return next_obj
}

watch(ctx.objects, () => {
  computeTrajectory()
}, { deep: true })
</script>

<template>
  <div class="hidden" />
</template>