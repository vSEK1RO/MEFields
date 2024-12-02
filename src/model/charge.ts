import { IObject } from "."
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

const sphereGeometry = new THREE.SphereGeometry(0.1, 16, 16);
const positiveMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const negativeMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
const neutralMaterial = new THREE.MeshBasicMaterial({ color: 0x888888 });

export function createCharge(obj: ICharge) {
  let material = neutralMaterial
  if (obj.userData.charge > 0) {
    material = positiveMaterial
  } else if (obj.userData.charge < 0) {
    material = negativeMaterial
  }
  const charge = new THREE.Mesh(sphereGeometry, material)
  charge.position.copy(obj.position)
  return charge
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