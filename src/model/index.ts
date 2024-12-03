export { IObject } from './types';
export { createCharge, getCharges, createElectricVector, type ICharge } from './charge'
export { createWire, getWires, createMagneticVector, type IWire } from './wire'
export { createParticle, getParticle, type IParticle } from './particle'
export { createAxis } from './axis'

import * as THREE from 'three'

export const sphereGeometry = new THREE.SphereGeometry(0.1, 16, 16);
export const positiveMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
export const negativeMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
export const neutralMaterial = new THREE.MeshBasicMaterial({ color: 0x888888 });