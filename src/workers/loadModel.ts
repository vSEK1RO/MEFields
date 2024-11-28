import { Object3DJSON } from "three"
import { GLTF, GLTFLoader } from "three/examples/jsm/Addons.js"
import { GLTFCurveExtension } from '../plugins'

export interface LoadModelRequest {
  file: File
}

export interface LoadModelResponse {
  status: LoadModelStatus
  scene_json?: Object3DJSON
  percentage?: number
  err?: DOMException
}

export type LoadModelStatus = typeof LoadModelStatus.values[number]
export namespace LoadModelStatus {
  export const values = [
    'ERROR',
    'LOADING',
    'LOADED',
  ]
}

self.onmessage = (event: MessageEvent<LoadModelRequest>) => {
    const fileURL = URL.createObjectURL(event.data.file)
    const loader = new GLTFLoader()
    loader.register(parser => new GLTFCurveExtension(parser))
    loader.load(fileURL, (gltf: GLTF) => {
      self.postMessage({status: 'LOADED', scene_json: gltf.scene.toJSON() } as LoadModelResponse)
    }, (progress: ProgressEvent) => {
      self.postMessage({status: 'LOADING', percentage: progress.loaded / event.data.file.size * 100 } as LoadModelResponse)
    }, (err: unknown) => {
      self.postMessage({status: 'ERROR', err } as LoadModelResponse)
    })
}