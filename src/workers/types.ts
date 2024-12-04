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