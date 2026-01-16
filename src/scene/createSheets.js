import * as THREE from "three";
import { loadImageTexture } from "./imageTexture.js";
import { createGlowFrame } from "./glowFrame.js";
import { mainPages } from "../content/pages.js";

export function createSheets({ sheetWidth = 2.2, sheetHeight = 1.4 } = {}) {
  const group = new THREE.Group();
  const geometry = new THREE.PlaneGeometry(sheetWidth, sheetHeight, 12, 6);
  const labelGeometry = new THREE.PlaneGeometry(sheetWidth * 0.9, 0.32);

  function wrapText(ctx, text, maxWidth) {
    const words = text.split(" ");
    const lines = [];
    let line = "";
    words.forEach((word) => {
      const testLine = line ? `${line} ${word}` : word;
      const width = ctx.measureText(testLine).width;
      if (width > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = testLine;
      }
    });
    if (line) {
      lines.push(line);
    }
    return lines.slice(0, 2);
  }

  function createLabelTexture(text) {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");

    ctx.fillStyle = "rgba(255, 255, 255, 0.92)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "#0f1a20";
    ctx.font = "600 22px \"Palatino Linotype\", \"Book Antiqua\", Palatino, serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const lines = wrapText(ctx, text, canvas.width - 60);
    const lineHeight = 28;
    const startY = canvas.height / 2 - ((lines.length - 1) * lineHeight) / 2;
    lines.forEach((line, index) => {
      ctx.fillText(line, canvas.width / 2, startY + index * lineHeight);
    });

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;
    return texture;
  }

  const sheets = mainPages.map((entry, index) => {
    const baseColor = entry.side === "left" ? 0xeaf1f5 : 0xe3eef4;
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      toneMapped: false
    });

    const mesh = new THREE.Mesh(geometry, material);
    const x = entry.side === "left" ? -3 : 3;
    const y = 0.2;
    mesh.position.set(x, y, entry.z);

    const inward = entry.side === "left" ? 0.25 : -0.25;
    mesh.rotation.set(0, inward, 0);

    const glow = createGlowFrame({
      width: sheetWidth,
      height: sheetHeight,
      thickness: 0.05,
      zOffset: 0.01
    });
    mesh.add(glow.group);

    const labelTexture = createLabelTexture(entry.subtitle || entry.title || entry.label);
    const labelMaterial = new THREE.MeshBasicMaterial({
      map: labelTexture,
      transparent: true,
      toneMapped: false
    });
    const labelMesh = new THREE.Mesh(labelGeometry, labelMaterial);
    labelMesh.position.set(0, -(sheetHeight / 2 + 0.28), 0.02);
    mesh.add(labelMesh);

    const sway = {
      baseRotation: mesh.rotation.clone(),
      basePosition: mesh.position.clone(),
      speed: 0.6 + index * 0.07,
      phase: index * 0.6
    };

    loadImageTexture(entry.image).then(({ texture, isFallback }) => {
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

    return {
      ...entry,
      index,
      mesh,
      material,
      glow,
      labelMesh,
      isSelected: false,
      sway
    };
  });

  function setSelected(id) {
    sheets.forEach((sheet) => {
      sheet.isSelected = sheet.id === id;
    });
  }

  function updateSway(time) {
    sheets.forEach((sheet) => {
      const sway = Math.sin(time * sheet.sway.speed + sheet.sway.phase) * 0.035;
      const lift = Math.sin(time * 0.7 + sheet.sway.phase) * 0.05;
      sheet.mesh.rotation.z = sheet.sway.baseRotation.z + sway;
      sheet.mesh.position.y = sheet.sway.basePosition.y + lift;
    });
  }

  function updateGlow(time) {
    sheets.forEach((sheet) => {
      if (sheet.isSelected) {
        const pulse = 0.55 + Math.sin(time * 2) * 0.1;
        sheet.glow.setGlow(pulse);
      } else {
        sheet.glow.setGlow(0.0);
      }
    });
  }

  function getSheetById(id) {
    return sheets.find((sheet) => sheet.id === id);
  }

  function getSheetByMesh(mesh) {
    return sheets.find((sheet) => sheet.mesh === mesh);
  }

  return { group, sheets, setSelected, updateSway, updateGlow, getSheetById, getSheetByMesh };
}
