import * as THREE from "three";
import { gsap } from "gsap";
import { createScene } from "./scene/createScene.js";
import { createCorridor } from "./scene/createCorridor.js";
import { createSheets } from "./scene/createSheets.js";
import { loadImageTexture } from "./scene/imageTexture.js";
import { createSlider } from "./ui/slider.js";
import { createDetailUI } from "./ui/detailUI.js";
import { createCameraRail } from "./controls/cameraRail.js";
import { createAppState } from "./state/appState.js";
import { mainPages, detailPages } from "./content/pages.js";
import "./style.css";

const app = document.getElementById("app");
const sceneHost = document.getElementById("scene");
const uiHost = document.querySelector(".hero-scene");

const scene = createScene();
const corridor = createCorridor();
scene.add(corridor);

const { group: sheetsGroup, sheets, setSelected, updateSway, updateGlow, getSheetById, getSheetByMesh } = createSheets();
scene.add(sheetsGroup);

const initialWidth = sceneHost.clientWidth || window.innerWidth;
const initialHeight = sceneHost.clientHeight || window.innerHeight;
const camera = new THREE.PerspectiveCamera(50, initialWidth / initialHeight, 0.1, 60);
camera.position.set(0, 1, 3);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(sceneHost.clientWidth || window.innerWidth, sceneHost.clientHeight || window.innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setClearColor(0xe7ecef, 1);
sceneHost.appendChild(renderer.domElement);

const cameraRail = createCameraRail(camera);
const appState = createAppState();

const slider = createSlider({
  sections: mainPages,
  onChange: (index) => {
    const section = mainPages[index];
    if (section && appState.getMode() === "corridor") {
      cameraRail.focusOn(section);
      setSelected(section.id);
    }
  },
  enableWheel: true
});

uiHost.appendChild(slider.element);

const dimOverlay = document.createElement("div");
dimOverlay.className = "dim-overlay";
uiHost.appendChild(dimOverlay);

const detailUI = createDetailUI({
  onBack: () => exitDetailMode(),
  onPrev: () => moveDetail(-1),
  onNext: () => moveDetail(1)
});
uiHost.appendChild(detailUI.element);
detailUI.setVisible(false);

let detailCarousel = null;
let detailIndex = 0;
let corridorCameraState = null;
let focusedSheet = null;
let autoplayTimer = null;

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

renderer.domElement.addEventListener("pointerdown", (event) => {
  if (appState.getMode() !== "corridor") {
    return;
  }

  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const hits = raycaster.intersectObjects(sheets.map((sheet) => sheet.mesh), false);
  if (!hits.length) {
    return;
  }
  const mesh = hits[0].object;
  const sheet = getSheetByMesh(mesh);
  if (sheet) {
    slider.setValue(sheet.index);
    if (sheet.clickable) {
      enterDetailMode(sheet.id);
    }
  }
});

function buildDetailCarousel(pageId) {
  const items = detailPages[pageId] || [];
  const group = new THREE.Group();
  const geometry = new THREE.PlaneGeometry(2.6, 1.6);

  const entries = items.map((item, index) => {
    const baseColor = 0xeff5f8;
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      toneMapped: false
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(index * 2.9, 0, 0);

    loadImageTexture(item.image).then(({ texture, isFallback }) => {
      if (isFallback || !texture) {
        material.map = null;
        material.color.setHex(baseColor);
      } else {
        material.map = texture;
        material.color.setHex(0xffffff);
      }
      material.needsUpdate = true;
    });

    group.add(mesh);
    return { ...item, mesh };
  });

  return { group, items: entries, spacing: 2.9 };
}

function enterDetailMode(pageId) {
  if (!detailPages[pageId]) {
    return;
  }

  appState.setMode("detail");
  slider.setDisabled(true);
  dimOverlay.classList.add("active");
  setSelected(pageId);
  stopAutoPlay();

  corridorCameraState = cameraRail.getState();
  focusedSheet = getSheetById(pageId);

  const target = focusedSheet;
  target.mesh.position.y = target.sway.basePosition.y;
  const targetPosition = new THREE.Vector3(0, 1.2, target.z + 1.6);
  const lookAt = new THREE.Vector3(target.mesh.position.x, target.mesh.position.y, target.mesh.position.z);

  cameraRail.tweenTo({ position: targetPosition, lookAt, duration: 1.1 });

  const temp = new THREE.Object3D();
  temp.position.copy(target.mesh.position);
  temp.lookAt(camera.position);
  const faceRotation = temp.rotation.clone();

  gsap.to(target.mesh.rotation, {
    x: faceRotation.x,
    y: faceRotation.y,
    z: 0,
    duration: 1.1,
    ease: "power3.out"
  });

  detailIndex = 0;
  if (detailCarousel) {
    scene.remove(detailCarousel.group);
  }
  detailCarousel = buildDetailCarousel(pageId);
  detailCarousel.group.position.set(0, 0.2, target.z + 0.3);
  scene.add(detailCarousel.group);

  detailUI.setVisible(true);
  updateDetailIndicator();
}

function exitDetailMode() {
  if (!corridorCameraState) {
    return;
  }

  appState.setMode("corridor");
  slider.setDisabled(false);
  dimOverlay.classList.remove("active");
  detailUI.setVisible(false);
  startAutoPlay();

  cameraRail.tweenTo({
    position: corridorCameraState.position,
    lookAt: corridorCameraState.lookAt,
    duration: 1.1
  });

  if (focusedSheet) {
    const targetSheet = focusedSheet;
    gsap.to(targetSheet.mesh.rotation, {
      x: targetSheet.sway.baseRotation.x,
      y: targetSheet.sway.baseRotation.y,
      z: targetSheet.sway.baseRotation.z,
      duration: 1.1,
      ease: "power3.out"
    });

  }

  if (detailCarousel) {
    scene.remove(detailCarousel.group);
    detailCarousel = null;
  }

  const currentIndex = Number(slider.element.querySelector("input").value || 0);
  const currentPage = mainPages[currentIndex];
  if (currentPage) {
    setSelected(currentPage.id);
  }
}

function moveDetail(direction) {
  if (!detailCarousel) {
    return;
  }
  const count = detailCarousel.items.length;
  detailIndex = Math.max(0, Math.min(count - 1, detailIndex + direction));
  gsap.to(detailCarousel.group.position, {
    x: -detailIndex * detailCarousel.spacing,
    duration: 0.8,
    ease: "power3.out"
  });
  updateDetailIndicator();
}

function updateDetailIndicator() {
  if (!detailCarousel) {
    return;
  }
  const total = detailCarousel.items.length;
  const page = detailCarousel.items[detailIndex];
  const label = page ? page.title : "";
  detailUI.setIndicator(`${label} (${detailIndex + 1}/${total})`);
}

cameraRail.focusOn(mainPages[0]);
setSelected(mainPages[0].id);
startAutoPlay();

function getSceneSize() {
  const width = sceneHost.clientWidth || window.innerWidth;
  const height = sceneHost.clientHeight || window.innerHeight;
  return { width, height };
}

function handleResize() {
  const { width, height } = getSceneSize();
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

window.addEventListener("resize", handleResize);

const clock = new THREE.Clock();

function animate() {
  const elapsed = clock.getElapsedTime();
  if (appState.getMode() === "corridor") {
    updateSway(elapsed);
  }
  updateGlow(elapsed);
  cameraRail.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();

function startAutoPlay() {
  if (autoplayTimer) {
    return;
  }
  autoplayTimer = setInterval(() => {
    if (appState.getMode() !== "corridor") {
      return;
    }
    const nextIndex = (slider.getValue() + 1) % mainPages.length;
    slider.setValue(nextIndex);
  }, 3000);
}

function stopAutoPlay() {
  if (!autoplayTimer) {
    return;
  }
  clearInterval(autoplayTimer);
  autoplayTimer = null;
}
