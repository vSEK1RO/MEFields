import * as THREE from 'three'
import { IAppContext } from '../App.vue'
import { parseVector3 } from './parseVector3'

export const OFFSET = 5
export const STEP = 0.5
export const COUNTX = 30
export const COUNTY = 20

export interface ICameraBox {
  position_json: string,
  x_axis_json: string,
  y_axis_json: string,
}

export function cameraBox(ctx: IAppContext): ICameraBox {
  const camera_dir = new THREE.Vector3()
  ctx.camera.getWorldDirection(camera_dir).normalize()
  const position = ctx.camera.position.clone().add(camera_dir.multiplyScalar(OFFSET))

  const camera_mat = new THREE.Matrix4().extractRotation(ctx.camera.matrixWorld)
  const x_axis = new THREE.Vector3(1, 0, 0).applyMatrix4(camera_mat)
  const y_axis = new THREE.Vector3(0, 1, 0).applyMatrix4(camera_mat)

  return {
    position_json: JSON.stringify(position),
    x_axis_json: JSON.stringify(x_axis),
    y_axis_json: JSON.stringify(y_axis),
  }
}

export function parseCameraBox(camera_box: ICameraBox) {
  const x_axis = parseVector3(camera_box.x_axis_json).normalize()
  const y_axis = parseVector3(camera_box.y_axis_json).normalize()
  return {
    x_axis,
    y_axis,
    position: parseVector3(camera_box.position_json)
      .sub(x_axis.clone().multiplyScalar(STEP * COUNTX / 2))
      .add(y_axis.clone().multiplyScalar(STEP * COUNTY / 2)),
  }
}

export function gridPositions(camera_box: ICameraBox) {
  const { x_axis, y_axis, position } = parseCameraBox(camera_box)

  const positions: THREE.Vector3[] = []
  for (let x = 0; x < COUNTX; x++) {
    for (let y = 0; y < COUNTY; y++) {
      const offset = position.clone()
      positions.push(offset
        .add(x_axis.clone().multiplyScalar(STEP * x))
        .sub(y_axis.clone().multiplyScalar(STEP * y))
      )
    }
  }
  return positions
}

export function transform(vec: THREE.Vector3, camera_box: ICameraBox) {
  const { x_axis, y_axis, position } = parseCameraBox(camera_box)

  return position.clone()
    .addScaledVector(y_axis, vec.y)
    .addScaledVector(x_axis, vec.x)
    .addScaledVector(new THREE.Vector3().crossVectors(x_axis, y_axis), vec.z)
}