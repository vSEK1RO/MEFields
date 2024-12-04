import * as THREE from 'three';

export function createAxis() {
    const group = new THREE.Group()
    const xPoints = [
        new THREE.Vector3(-5, 0, 0),
        new THREE.Vector3(5, 0, 0)
    ];
    const xGeometry = new THREE.BufferGeometry().setFromPoints(xPoints);
    const xAxis = new THREE.Line(xGeometry, new THREE.LineBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.2 }));
    group.add(xAxis);

    const yPoints = [
        new THREE.Vector3(0, -5, 0),
        new THREE.Vector3(0, 5, 0)
    ];
    const yGeometry = new THREE.BufferGeometry().setFromPoints(yPoints);
    const yAxis = new THREE.Line(yGeometry, new THREE.LineBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.2 }));
    group.add(yAxis);

    const zPoints = [
        new THREE.Vector3(0, 0, -5),
        new THREE.Vector3(0, 0, 5)
    ];
    const zGeometry = new THREE.BufferGeometry().setFromPoints(zPoints);
    const zAxis = new THREE.Line(zGeometry, new THREE.LineBasicMaterial({ color: 0x0000ff, transparent: true, opacity: 0.2}));
    group.add(zAxis);
    return group
}