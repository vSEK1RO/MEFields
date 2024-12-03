import { IAppContext } from '../App.vue'
import { IObject, negativeMaterial, neutralMaterial, positiveMaterial, sphereGeometry } from "."
import * as THREE from 'three'

export interface IParticle extends IObject {
  userData: IParticle.UserData
  position: THREE.Vector3
  direction: THREE.Vector3
}

export namespace IParticle {

  export interface UserData extends IObject.UserData {
    charge: number
    mass: number
    speed: number
  }
}

export function createParticle(ctx: IAppContext, obj: IParticle) {
  obj.three = new THREE.Group()
  obj.three.add(new THREE.ArrowHelper(
    obj.direction.clone().normalize(),
    obj.position,
    1,
    0x000000,
    0.2,
    0.1,
  ))
  let material = neutralMaterial
  if (obj.userData.charge > 0) {
    material = positiveMaterial
  } else if (obj.userData.charge < 0) {
    material = negativeMaterial
  }
  const mesh = new THREE.Mesh(sphereGeometry, material)
  mesh.position.copy(obj.position)
  obj.three.add(mesh)
  ctx.objects.value.push(obj)
  ctx.scene.add(obj.three)
}

export function getParticle(obj: THREE.Object3D) {
  const mesh = obj as THREE.Mesh
  const userData = mesh.userData as IParticle.UserData

  console.log(mesh)

  return {
    userData: {
      type: userData.type,
      charge: userData.charge,
      mass: userData.mass,
      speed: userData.speed,
    },
    position: new THREE.Vector3(mesh.position.x, mesh.position.y, mesh.position.z),
    direction: new THREE.Vector3(1, 0, 0).normalize(),
  } as IParticle
}