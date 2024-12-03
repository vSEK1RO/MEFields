import * as THREE from 'three'
import { IWorker } from "./types"
import { ICharge, IObject } from '../model'
import { gridPositions } from '../utils/gridPositions'

export namespace IElectricFieldWorker {
  export interface Request {
    objs_json: string,
    start_json: string,
    step: number,
    count: number,
  }

  export interface Response {
    status: IWorker.Status
    vectors_json: string,
    percentage?: number
    err?: DOMException
  }

  export namespace Responce {
    export type Vectors = {
      dir: THREE.Vector3,
      pos: THREE.Vector3,
    }[]
  }
}

const k = 9e9

export function calcElectricField(pos: THREE.Vector3, objs: IObject[]) {
  const dir = new THREE.Vector3()
  objs.forEach(obj => {
    if (obj.userData.type !== 'CHARGE') return
    const charge = obj as ICharge
    const vec = pos.clone().sub(charge.position)
    const distance = vec.length()

    vec.normalize().multiplyScalar(k * charge.userData.charge / distance ** 2)
    dir.add(vec)
  })
  return { dir, pos }
}

self.onmessage = (event: MessageEvent<IElectricFieldWorker.Request>) => {
  const objs: IObject[] = JSON.parse(event.data.objs_json)
  const start: THREE.Vector3 = JSON.parse(event.data.start_json)
  const positions = gridPositions(start, event.data.step, event.data.count)

  self.postMessage({status: 'LOADING', percentage: 50 } as IElectricFieldWorker.Response)
  const vectors = positions.map(pos => calcElectricField(pos, objs))
  self.postMessage({status: 'LOADED', vectors_json: JSON.stringify(vectors) } as IElectricFieldWorker.Response)
}