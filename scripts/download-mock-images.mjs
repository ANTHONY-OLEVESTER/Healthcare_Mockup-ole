import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const targets = [
  {
    url: "https://t3.ftcdn.net/jpg/11/69/30/56/360_F_1169305634_oYUETRkz8Hjyk1YlwV8fy2wX1Z6GPP8S.jpg",
    file: "public/assets/images/home.jpg"
  },
  {
    url: "https://www.shutterstock.com/shutterstock/videos/3692590527/thumb/1.jpg?ip=x480",
    file: "public/assets/images/services.jpg"
  },
  {
    url: "https://www.shutterstock.com/shutterstock/videos/3969301451/thumb/1.jpg?ip=x480",
    file: "public/assets/images/careers.jpg"
  },
  {
    url: "https://www.b2w.tv/hubfs/healthcare%20explainer%20videos%20blog%20banner.png",
    file: "public/assets/images/mission.png"
  },
  {
    url: "https://www.shutterstock.com/shutterstock/videos/3692594153/thumb/7.jpg?ip=x480",
    file: "public/assets/images/referrals.jpg"
  },
  {
    url: "https://www.shutterstock.com/shutterstock/videos/3961420355/thumb/1.jpg?ip=x480",
    file: "public/assets/images/contact.jpg"
  },
  {
    url: "https://static.vecteezy.com/system/resources/thumbnails/013/447/851/small/animated-visit-patient-illustration-doctor-giving-medical-results-general-screening-looped-flat-color-2d-cartoon-characters-animation-in-hd-with-hospital-interior-on-transparent-background-video.jpg",
    file: "public/assets/images/extra_1.jpg"
  },
  {
    url: "https://www.shutterstock.com/shutterstock/videos/3842205253/thumb/1.jpg?ip=x480",
    file: "public/assets/images/extra_2.jpg"
  },
  {
    url: "https://www.shutterstock.com/shutterstock/videos/3573903363/thumb/9.jpg?ip=x480",
    file: "public/assets/images/extra_3.jpg"
  },
  {
    url: "https://www.shutterstock.com/shutterstock/videos/3797314687/thumb/1.jpg?ip=x480",
    file: "public/assets/images/extra_4.jpg"
  }
];

const placeholderPngBase64 =
  "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAQAAAC1+jfqAAAAKElEQVR4nGNgYGD4z0AEYBxVSFQqCqGg0A1Eo2QYBQAAm+oE0cG7j8wAAAAASUVORK5CYII=";

const placeholderJpgBase64 =
  "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAALCAAFAAUABAREA/8QAFQABAQAAAAAAAAAAAAAAAAAAAAb/xAAVEAEBAAAAAAAAAAAAAAAAAAABAP/aAAwDAQACEQMRAD8AqAAA/9k=";

function getPlaceholderBuffer(ext) {
  const base64 = ext === ".png" ? placeholderPngBase64 : placeholderJpgBase64;
  return Buffer.from(base64, "base64");
}

async function ensureDir(filePath) {
  const dir = path.dirname(filePath);
  await mkdir(dir, { recursive: true });
}

async function downloadToFile(url, filePath) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    if (!buffer.length) {
      throw new Error("Empty response");
    }
    await writeFile(filePath, buffer);
    console.log(`Downloaded: ${filePath}`);
    return true;
  } catch (error) {
    console.warn(`Failed to download ${url}. Using placeholder.`, error.message);
    return false;
  }
}

async function writePlaceholder(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const buffer = getPlaceholderBuffer(ext === ".png" ? ".png" : ".jpg");
  await writeFile(filePath, buffer);
  console.log(`Wrote placeholder: ${filePath}`);
}

async function run() {
  for (const target of targets) {
    const filePath = path.resolve(target.file);
    await ensureDir(filePath);
    const ok = await downloadToFile(target.url, filePath);
    if (!ok) {
      await writePlaceholder(filePath);
    }
  }
}

run().catch((error) => {
  console.error("Download script failed.", error);
  process.exit(1);
});
