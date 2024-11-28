import { ObjectUserData } from "./types"
import * as THREE from 'three'

export interface Charge {
  userData: ChargeUserData
  position: THREE.Vector3
}

export interface ChargeUserData extends ObjectUserData {
  charge: number
}

const sphereGeometry = new THREE.SphereGeometry(0.2, 16, 16);
const positiveMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const negativeMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });

export function createCharge(obj: Charge) {
  const charge = new THREE.Mesh(sphereGeometry, obj.userData.charge > 0 ? positiveMaterial : negativeMaterial)
  charge.position.copy(obj.position)
  return charge
}

export function getCharges(obj: THREE.Object3D) {
  const mesh = obj as THREE.Mesh
  const charges: Charge[] = []
  const positionAttr = mesh.geometry.attributes.position
  const userData = mesh.userData as ChargeUserData

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