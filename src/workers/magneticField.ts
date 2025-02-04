import * as THREE from 'three'
import { IObject, IWire } from '../model'
import { IFieldWorker } from './types'
import { gridPositions, ICameraBox } from '../utils/gridPositions'

export function calcMagneticField(pos: THREE.Vector3, objs: IObject[]) {
  const dir = new THREE.Vector3()
  objs.forEach(obj => {
    if (obj.userData.type !== 'WIRE') return
    const wire = obj as IWire

    const m1m2_v = new THREE.Vector3().subVectors(wire.end, wire.start)
    const m1m_v = new THREE.Vector3().subVectors(pos, wire.start)
    const m0m_v = new THREE.Vector3().subVectors(m1m_v, m1m2_v.clone().multiplyScalar(
      m1m_v.dot(m1m2_v) / m1m2_v.dot(m1m2_v)
    ))

    const m0 = new THREE.Vector3().subVectors(pos, m0m_v)

    const m0m = m0m_v.length()
    const m0m2 = new THREE.Vector3().subVectors(wire.end, m0).length()
    const mm2 = new THREE.Vector3().subVectors(wire.end, pos).length()
    const m0m1 = new THREE.Vector3().subVectors(wire.start, m0).length()
    const mm1 = m1m_v.length()

    const direction = new THREE.Vector3().crossVectors(m1m2_v, m0m_v).normalize()
    const magnitude = wire.userData.amperage * 10 ** -7 * ( m0m2 / mm2 + m0m1 / mm1) / m0m

    dir.add(direction.multiplyScalar(magnitude))
  })
  return { dir, pos }
}


self.onmessage = (event: MessageEvent<IFieldWorker.Request>) => {
  const objs: IObject[] = JSON.parse(event.data.objs_json)
  const camera_box: ICameraBox = JSON.parse(event.data.camera_box_json)
  const positions = gridPositions(camera_box)

  self.postMessage({status: 'LOADING', percentage: 50 } as IFieldWorker.Response)
  const vectors = positions.map(pos => calcMagneticField(pos, objs))
  self.postMessage({status: 'LOADED', vectors_json: JSON.stringify(vectors) } as IFieldWorker.Response)
  self.close()
}