import { ObjectUserData } from "."
import * as THREE from 'three'

export interface Wire {
  userData: WireUserData
  position: THREE.Vector3
  direction: THREE.Vector3
}

export interface WireUserData extends ObjectUserData {
  amperage: number
}

export function createWire(obj: Wire) {
  
}

export function getWires(obj: THREE.Object3D) {
  console.log(obj)
}