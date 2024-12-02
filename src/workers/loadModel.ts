import { Object3DJSON } from "three"
import { GLTF, GLTFLoader } from "three/examples/jsm/Addons.js"
import { GLTFCurveExtension } from '../plugins'
import { IWorker } from "./types"

export namespace ILoadModelWorker {
  export interface Request {
    file: File
  }

  export interface Response {
    status: IWorker.Status
    scene_json?: Object3DJSON
    percentage?: number
    err?: DOMException
  }
}

self.onmessage = (event: MessageEvent<ILoadModelWorker.Request>) => {
    const fileURL = URL.createObjectURL(event.data.file)
    const loader = new GLTFLoader()
    loader.register(parser => new GLTFCurveExtension(parser))
    loader.load(fileURL, (gltf: GLTF) => {
      self.postMessage({status: 'LOADED', scene_json: gltf.scene.toJSON() } as ILoadModelWorker.Response)
    }, (progress: ProgressEvent) => {
      self.postMessage({status: 'LOADING', percentage: progress.loaded / event.data.file.size * 100 } as ILoadModelWorker.Response)
    }, (err: unknown) => {
      self.postMessage({status: 'ERROR', err } as ILoadModelWorker.Response)
    })
}