import * as THREE from "three";

/**
 * Hospital palette (cool + clean)
 * Wall base      → #eaf2f6
 * Floor tiles    → #cfd8df
 * Ceiling        → #f7fbff
 * Accent teal    → #5fd3c7
 * Accent blue    → #0a6b78
 * Trim / rail    → #d3e1e8
 * Door frames    → #e1edf3
 */

function makeCeilingLightPanel({ w = 2.2, z = -2, y = 1.98 } = {}) {
  // Emissive light panel (hospital ceiling light)
  const geo = new THREE.PlaneGeometry(w, w * 0.45);

  const mat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xe8f6ff,          // slight clinical blue tint
    emissiveIntensity: 1.25,
    roughness: 0.18,
    metalness: 0.0,
    transparent: true,
    opacity: 0.98,
  });

  const panel = new THREE.Mesh(geo, mat);
  panel.rotation.x = Math.PI / 2; // face down
  panel.position.set(0, y, z);
  return panel;
}

function makeWallSign({ textColor = 0x0a6b78 } = {}) {
  // Simple sign plate (no text rendering; replace with textures later)
  const group = new THREE.Group();

  const plate = new THREE.Mesh(
    new THREE.PlaneGeometry(1.4, 0.35),
    new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.45,
      metalness: 0.0,
    })
  );
  plate.position.set(0, 1.2, 0.01);

  const stripe = new THREE.Mesh(
    new THREE.PlaneGeometry(1.4, 0.06),
    new THREE.MeshStandardMaterial({
      color: textColor,
      roughness: 0.65,
      metalness: 0.0,
    })
  );
  stripe.position.set(0, 1.05, 0.012);

  group.add(plate, stripe);
  return group;
}

function makeDoor({ side = "left", x = -4.85, z = -6 } = {}) {
  const doorGroup = new THREE.Group();

  // Frame (slightly darker than wall)
  const frameMat = new THREE.MeshStandardMaterial({
    color: 0xe1edf3,
    roughness: 0.55,
    metalness: 0.0,
  });

  const frame = new THREE.Mesh(new THREE.BoxGeometry(0.14, 2.25, 1.2), frameMat);
  frame.position.set(x, -0.1, z);

  // Door slab (near-white)
  const doorMat = new THREE.MeshStandardMaterial({
    color: 0xf9fcff,
    roughness: 0.32,
    metalness: 0.02,
  });

  const door = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.05, 0.95), doorMat);
  door.position.set(x + (side === "left" ? 0.09 : -0.09), -0.12, z);

  // Small window (frosted)
  const winMat = new THREE.MeshStandardMaterial({
    color: 0xcfeaf0,
    roughness: 0.08,
    metalness: 0.0,
    transparent: true,
    opacity: 0.55,
  });
  const win = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.35, 0.35), winMat);
  win.position.set(door.position.x + (side === "left" ? 0.045 : -0.045), 0.35, z);

  // Handle
  const handleMat = new THREE.MeshStandardMaterial({
    color: 0x9fb3bf,
    roughness: 0.25,
    metalness: 0.2,
  });
  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.18, 16), handleMat);
  handle.rotation.z = Math.PI / 2;
  handle.position.set(door.position.x, -0.05, z + 0.25);

  doorGroup.add(frame, door, win, handle);
  return doorGroup;
}

function makeHandrail({ x = -4.75, zStart = 0, zEnd = -30 } = {}) {
  const railGroup = new THREE.Group();

  // Slightly darker trim color (wear-friendly)
  const railMat = new THREE.MeshStandardMaterial({
    color: 0xd3e1e8,
    roughness: 0.35,
    metalness: 0.05,
  });

  const len = Math.abs(zEnd - zStart);

  const rail = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, len, 16), railMat);
  rail.rotation.x = Math.PI / 2;
  rail.position.set(x, -0.35, (zStart + zEnd) / 2);

  // Supports every ~3m
  for (let i = 0; i <= Math.floor(len / 3); i++) {
    const z = zStart - i * 3;
    const sup = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.25, 12), railMat);
    sup.position.set(x, -0.48, z);
    railGroup.add(sup);
  }

  railGroup.add(rail);
  return railGroup;
}

export function createCorridor({ width = 10, height = 4, length = 30 } = {}) {
  const group = new THREE.Group();

  // ===== Updated hospital colors =====
  const wallMat = new THREE.MeshStandardMaterial({
    color: 0xeaf2f6,     // cool hospital wall
    roughness: 0.85,
    metalness: 0.02,
  });

  const floorMat = new THREE.MeshStandardMaterial({
    color: 0xcfd8df,     // cool tile gray
    roughness: 0.33,     // slight gloss
    metalness: 0.05,
  });

  const ceilingMat = new THREE.MeshStandardMaterial({
    color: 0xf7fbff,     // near-white ceiling
    roughness: 0.9,
    metalness: 0.01,
  });

  // Base corridor shell
  const floor = new THREE.Mesh(new THREE.BoxGeometry(width, 0.12, length), floorMat);
  floor.position.set(0, -height / 2, -length / 2);
  group.add(floor);

  const ceiling = new THREE.Mesh(new THREE.BoxGeometry(width, 0.1, length), ceilingMat);
  ceiling.position.set(0, height / 2, -length / 2);
  group.add(ceiling);

  const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.12, height, length), wallMat);
  leftWall.position.set(-width / 2, 0, -length / 2);
  group.add(leftWall);

  const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.12, height, length), wallMat);
  rightWall.position.set(width / 2, 0, -length / 2);
  group.add(rightWall);

  const backWall = new THREE.Mesh(new THREE.BoxGeometry(width, height, 0.12), wallMat);
  backWall.position.set(0, 0, -length);
  group.add(backWall);

  // Baseboards (trim)
  const trimMat = new THREE.MeshStandardMaterial({
    color: 0xd3e1e8,     // trim/rail family
    roughness: 0.55,
    metalness: 0.0,
  });

  const trimH = 0.18;
  const trimT = 0.06;

  const leftTrim = new THREE.Mesh(new THREE.BoxGeometry(trimT, trimH, length), trimMat);
  leftTrim.position.set(-width / 2 + 0.06, -height / 2 + trimH / 2, -length / 2);
  group.add(leftTrim);

  const rightTrim = new THREE.Mesh(new THREE.BoxGeometry(trimT, trimH, length), trimMat);
  rightTrim.position.set(width / 2 - 0.06, -height / 2 + trimH / 2, -length / 2);
  group.add(rightTrim);

  // ===== Wayfinding stripe (instant hospital vibe) =====
  const stripeMat = new THREE.MeshStandardMaterial({
    color: 0x5fd3c7, // teal accent
    roughness: 0.65,
    metalness: 0.0,
  });

  const stripeH = 0.18;
  const stripeY = 0.35;

  const leftStripe = new THREE.Mesh(new THREE.BoxGeometry(0.03, stripeH, length), stripeMat);
  leftStripe.position.set(-width / 2 + 0.08, stripeY, -length / 2);
  group.add(leftStripe);

  const rightStripe = new THREE.Mesh(new THREE.BoxGeometry(0.03, stripeH, length), stripeMat);
  rightStripe.position.set(width / 2 - 0.08, stripeY, -length / 2);
  group.add(rightStripe);

  // Ceiling light panels every ~4m (tinted clinical)
  const spacing = 4;
  for (let z = -2; z >= -length + 2; z -= spacing) {
    const panel = makeCeilingLightPanel({ z, y: height / 2 - 0.02 });
    group.add(panel);

    // Real light paired with panel
    const light = new THREE.RectAreaLight(0xe8f6ff, 4.5, 2.0, 0.9);
    light.position.set(0, height / 2 - 0.08, z);
    light.rotation.x = -Math.PI / 2;
    group.add(light);
  }

  // Doors along the corridor (repeating hospital cue)
  const doorZs = [-6, -12, -18, -24];
  for (const z of doorZs) {
    group.add(makeDoor({ side: "left", x: -width / 2 + 0.55, z }));
    group.add(makeDoor({ side: "right", x: width / 2 - 0.55, z }));
  }

  // Handrails (very hospital)
  group.add(makeHandrail({ x: -width / 2 + 0.35, zStart: 0, zEnd: -length }));
  group.add(makeHandrail({ x: width / 2 - 0.35, zStart: 0, zEnd: -length }));

  // Wall signs near doors
  for (const z of doorZs) {
    const leftSign = makeWallSign({ textColor: 0x0a6b78 });
    leftSign.position.set(-width / 2 + 0.2, 0, z + 1.2);
    leftSign.rotation.y = Math.PI / 2;
    group.add(leftSign);

    const rightSign = makeWallSign({ textColor: 0x0a6b78 });
    rightSign.position.set(width / 2 - 0.2, 0, z + 1.2);
    rightSign.rotation.y = -Math.PI / 2;
    group.add(rightSign);
  }

  return group;
}
