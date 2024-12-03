import * as THREE from 'three'
import { IAppContext } from '../App.vue'

export const STEP = 0.5
export const COUNT = 1

export interface ICameraBox {
  start_json: string,
  step: number,
  count: number,
}

export function cameraBox(ctx: IAppContext): ICameraBox {
  const start = ctx.camera.position.clone()
  const offset = STEP * COUNT / 2
  start.sub(new THREE.Vector3(offset, offset, offset))
  start.x = Math.ceil(start.x / STEP) * STEP
  start.y = Math.ceil(start.y / STEP) * STEP
  start.z = Math.ceil(start.z / STEP) * STEP
  return {
    start_json: JSON.stringify(start),
    step: STEP,
    count: COUNT,
  }
}

export function gridPositions(start: THREE.Vector3, step: number, count: number) {
  const positions: THREE.Vector3[] = []
  for (let x = start.x; x < start.x + step * count; x += step) {
    for (let y = start.y; y < start.y + step * count; y += step) {
      for (let z = start.z; z < start.z + step * count; z += step) {
        positions.push(new THREE.Vector3(x,y,z))
      }
    }
  }
  return positions
}