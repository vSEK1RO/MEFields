import * as THREE from 'three'

export interface IObject {
  mesh?: THREE.Mesh
  userData: IObject.UserData
}

export namespace IObject {

  export type Type = typeof Type.values[number]
  export namespace Type {
    export const values = ['CHARGE', 'WIRE', 'PARTICLE']
  }

  export interface UserData {
    type: Type
  }
}