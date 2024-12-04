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

  export interface Curve {
    type: string
    arcLengthDivisions: number
    isCatmullRomCurve3: boolean
    points: { x: number, y: number, z: number }[]
    closed: boolean
    curveType: string
    tension: number
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

export function createMagneticVector(dir: THREE.Vector3, pos: THREE.Vector3) {
  const _dir = new THREE.Vector3(dir.x, dir.y, dir.z)
  const _pos = new THREE.Vector3(pos.x, pos.y, pos.z)
  return new THREE.ArrowHelper(
    _dir.clone().normalize(),
    _pos,
    Math.min(_dir.length(), 1),
    0xFF0000,
  )
}

export function getWires(obj: THREE.Object3D) {
  const line = obj as THREE.Line
  const wires: IWire[] = []
  const userData = line.userData as IWire.UserData & { curve: IWire.Curve }
  const points = userData.curve.points

  if (userData.curve.isCatmullRomCurve3) {
    for (let i = 0; i < points.length - 1; i++) {
      const start = new THREE.Vector3(points[i].x, points[i].y, points[i].z).add(line.position)
      const end = new THREE.Vector3(points[i + 1].x, points[i + 1].y, points[i + 1].z).add(line.position)
      wires.push({
        userData: {
          type: userData.type,
          amperage: userData.amperage,
        },
        start,
        end,
      })
    }
    if (userData.curve.closed) {
      wires.push({
        userData: {
          type: userData.type,
          amperage: userData.amperage,
        },
        start: new THREE.Vector3(points[points.length - 1].x, points[points.length - 1].y, points[points.length - 1].z).add(line.position),
        end: new THREE.Vector3(points[0].x, points[0].y, points[0].z).add(line.position),
      })
    }
  } else {
    throw Error('only catmullRomCurve3 supported')
  }
  return wires
}