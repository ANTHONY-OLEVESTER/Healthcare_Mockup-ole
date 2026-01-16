import * as THREE from "three";

export function createVideoTexture(src) {
  const video = document.createElement("video");
  video.src = src;
  video.loop = true;
  video.muted = true;
  video.playsInline = true;
  video.autoplay = true;
  video.setAttribute("preload", "auto");

  const ready = new Promise((resolve) => {
    const onCanPlay = () => {
      const texture = new THREE.VideoTexture(video);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;
      resolve({ texture, video, isFallback: false });
    };

    const onError = () => {
      console.warn(`Video failed to load: ${src}`);
      resolve({ texture: null, video, isFallback: true });
    };

    video.addEventListener("canplay", onCanPlay, { once: true });
    video.addEventListener("error", onError, { once: true });
  });

  video.play().catch(() => {
    console.warn(`Autoplay blocked or not ready for: ${src}`);
  });

  return { video, ready };
}
