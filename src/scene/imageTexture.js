import * as THREE from "three";

function createFallbackTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#cfd8de";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  return texture;
}

export function loadImageTexture(src) {
  const loader = new THREE.TextureLoader();

  return new Promise((resolve) => {
    loader.load(
      src,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = false;
        texture.anisotropy = 8;
        resolve({ texture, isFallback: false });
      },
      undefined,
      () => {
        console.warn(`Image failed to load: ${src}`);
        const texture = createFallbackTexture();
        texture.anisotropy = 8;
        resolve({ texture, isFallback: true });
      }
    );
  });
}
