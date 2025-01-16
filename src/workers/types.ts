import * as THREE from 'three'

export namespace IWorker {
  export type Status = typeof Status.values[number]
  export namespace Status {
    export const values = [
      'ERROR',
      'LOADING',
      'LOADED',
    ]
  }
}

export namespace IFieldWorker {
  export interface Request {
    objs_json: string
    camera_box_json: string
  }

  export interface Response {
    camera_box_json: string
    status: IWorker.Status
    vectors_json: string
    percentage?: number
    err?: DOMException
  }

  export namespace Response {
    export type Vectors = {
      dir: THREE.Vector3
      pos: THREE.Vector3
    }[]
  }
}