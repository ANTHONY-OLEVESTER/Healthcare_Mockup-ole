import * as THREE from "three";

export function createGlowFrame({ width, height, thickness = 0.05, zOffset = 0.01 } = {}) {
  const group = new THREE.Group();
  group.position.z = zOffset;

  const material = new THREE.MeshBasicMaterial({
    color: 0x7bdff2,
    transparent: true,
    opacity: 0.0,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    toneMapped: false
  });

  const topGeo = new THREE.PlaneGeometry(width + thickness * 2, thickness);
  const sideGeo = new THREE.PlaneGeometry(thickness, height);

  const top = new THREE.Mesh(topGeo, material);
  top.position.set(0, height / 2 + thickness / 2, 0);
  group.add(top);

  const bottom = new THREE.Mesh(topGeo, material);
  bottom.position.set(0, -(height / 2 + thickness / 2), 0);
  group.add(bottom);

  const left = new THREE.Mesh(sideGeo, material);
  left.position.set(-(width / 2 + thickness / 2), 0, 0);
  group.add(left);

  const right = new THREE.Mesh(sideGeo, material);
  right.position.set(width / 2 + thickness / 2, 0, 0);
  group.add(right);

  function setGlow(opacity) {
    material.opacity = opacity;
  }

  return { group, setGlow };
}
