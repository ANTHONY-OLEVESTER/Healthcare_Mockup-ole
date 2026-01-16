import * as THREE from "three";
import { gsap } from "gsap";

export function createCameraRail(camera) {
  const lookAtTarget = new THREE.Vector3(0, 0, -5);

  function focusOn(section) {
    const targetZ = section.z;
    const targetX = section.side === "left" ? -3 : 3;
    const targetY = 0.2;

    gsap.to(camera.position, {
      z: targetZ + 3,
      duration: 1.2,
      ease: "power3.out"
    });

    gsap.to(lookAtTarget, {
      z: targetZ,
      x: targetX,
      y: targetY,
      duration: 1.2,
      ease: "power3.out"
    });
  }

  function tweenTo({ position, lookAt, duration = 1.2 }) {
    gsap.to(camera.position, {
      x: position.x,
      y: position.y,
      z: position.z,
      duration,
      ease: "power3.out"
    });

    gsap.to(lookAtTarget, {
      x: lookAt.x,
      y: lookAt.y,
      z: lookAt.z,
      duration,
      ease: "power3.out"
    });
  }

  function getState() {
    return {
      position: camera.position.clone(),
      lookAt: lookAtTarget.clone()
    };
  }

  function setState(state) {
    camera.position.copy(state.position);
    lookAtTarget.copy(state.lookAt);
  }

  function update() {
    camera.lookAt(lookAtTarget);
  }

  return { focusOn, tweenTo, getState, setState, update, lookAtTarget };
}
