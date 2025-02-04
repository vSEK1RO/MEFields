import { IAppContext } from '../App.vue'
import { IObject, negativeMaterial, neutralMaterial, positiveMaterial, sphereGeometry } from "."
import * as THREE from 'three'

export interface ICharge extends IObject {
  userData: ICharge.UserData
  position: THREE.Vector3
}

export namespace ICharge {

  export interface UserData extends IObject.UserData {
    charge: number
  }
}

export function createCharge(ctx: IAppContext, obj: ICharge) {
  let material = neutralMaterial
  if (obj.userData.charge > 0) {
    material = positiveMaterial
  } else if (obj.userData.charge < 0) {
    material = negativeMaterial
  }
  obj.three = new THREE.Mesh(sphereGeometry, material)
  obj.three.position.copy(obj.position)
  ctx.objects.value.push(obj)
  ctx.scene.add(obj.three)
}

export function createElectricVector(dir: THREE.Vector3, pos: THREE.Vector3) {
  const _dir = new THREE.Vector3(dir.x, dir.y, dir.z)
  const _pos = new THREE.Vector3(pos.x, pos.y, pos.z)
  return new THREE.ArrowHelper(
    _dir.clone().normalize(),
    _pos,
    Math.min(_dir.length(), 1),
    0x0000FF,
  )
}

export function getCharges(obj: THREE.Object3D) {
  const mesh = obj as THREE.Mesh
  const charges: ICharge[] = []
  const positionAttr = mesh.geometry.attributes.position
  const userData = mesh.userData as ICharge.UserData

  for (let i = 0; i < positionAttr.count; i++) {
    const newCharge = {
      userData: {
        type: userData.type,
        charge: userData.charge,
      },
      position: mesh.localToWorld(new THREE.Vector3().fromBufferAttribute(positionAttr, i)),
    }
    if (!charges.find(charge => charge.position.equals(newCharge.position))) {
      charges.push(newCharge)
    }
  }
  return charges
}