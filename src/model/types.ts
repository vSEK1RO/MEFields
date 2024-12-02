export type ObjectType = typeof ObjectType.values[number]
export namespace ObjectType {
  export const values = ['CHARGE', 'WIRE', 'PARTICLE']
}

export interface ObjectUserData {
  type: ObjectType
}