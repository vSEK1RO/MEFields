import * as THREE from 'three'

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