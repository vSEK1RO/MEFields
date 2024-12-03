import { IObject } from "."
import * as THREE from 'three'
import { IAppContext } from "../App.vue"

export interface IWire extends IObject{
  userData: IWire.UserData
  start: THREE.Vector3
  end: THREE.Vector3
}

export namespace IWire {

  export interface UserData extends IObject.UserData {
    amperage: number
  }
}

const material = new THREE.LineBasicMaterial({ color: 0xFF0000 })

export function createWire(ctx: IAppContext, obj: IWire) {
  const vertices = new Float32Array([...obj.start.toArray(), ...obj.end.toArray()])
  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))

  obj.three = new THREE.Line(geometry, material)
  ctx.objects.value.push(obj)
  ctx.scene.add(obj.three)
}

export function getWires(obj: THREE.Object3D) {
  const line = obj as THREE.Line
  const wires: IWire[] = []
  const vertices = line.geometry.attributes.position.array
  const userData = line.userData as IWire.UserData

  for (let i = 0; i < vertices.length - 3; i += 3) {
    const start = new THREE.Vector3(vertices[i], vertices[i + 1], vertices[i + 2])
    const end = new THREE.Vector3(vertices[i + 3], vertices[i + 4], vertices[i + 5])
    wires.push({
      userData: {
        type: userData.type,
        amperage: userData.amperage,
      },
      start,
      end,
    })
  }
  return wires
}