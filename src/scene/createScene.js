import * as THREE from "three";

export function createScene() {
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0xe6eff4, 4, 28);

  const ambient = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambient);

  const keyLight = new THREE.DirectionalLight(0xffffff, 0.7);
  keyLight.position.set(5, 6, 4);
  scene.add(keyLight);

  const fillLight = new THREE.PointLight(0xffffff, 0.4, 40);
  fillLight.position.set(-4, 2, -6);
  scene.add(fillLight);

  return scene;
}
