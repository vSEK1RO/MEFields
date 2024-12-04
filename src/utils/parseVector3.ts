import * as THREE from 'three'

export function parseVector3(vector_json: string) {
  const vec: THREE.Vector3 = JSON.parse(vector_json)
  return new THREE.Vector3(vec.x, vec.y, vec.z)
}