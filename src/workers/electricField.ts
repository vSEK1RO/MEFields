import * as THREE from 'three'
import { IFieldWorker } from "./types"
import { ICharge, IObject } from '../model'
import { gridPositions, ICameraBox } from '../utils/gridPositions'

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

self.onmessage = (event: MessageEvent<IFieldWorker.Request>) => {
  const objs: IObject[] = JSON.parse(event.data.objs_json)
  const camera_box: ICameraBox = JSON.parse(event.data.camera_box_json)
  const positions = gridPositions(camera_box)

  self.postMessage({status: 'LOADING', percentage: 50 } as IFieldWorker.Response)
  const vectors = positions.map(pos => calcElectricField(pos, objs))
  self.postMessage({status: 'LOADED', vectors_json: JSON.stringify(vectors), camera_box_json: event.data.camera_box_json } as IFieldWorker.Response)
  self.close()
}