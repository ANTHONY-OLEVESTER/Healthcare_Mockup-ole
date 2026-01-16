# Hospital Corridor Video Sheets

A Three.js + GSAP corridor scene with hanging sheets, a slider-based camera rail, and a detail mode for Services and Careers.

## Setup

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Video placeholders

Place local MP4 files in `public/videos/` with these names:

- `home.mp4`
- `services.mp4`
- `mission.mp4`
- `careers.mp4`
- `referral.mp4`
- `contact.mp4`

If a video is missing or fails to load, the sheet shows a fallback color and logs a warning.

## Image placeholders

Place local images in `public/assets/images/` with these names:

Main sheets:
- `home.jpg`
- `services.jpg`
- `mission.jpg`
- `careers.jpg`
- `referrals.jpg`
- `contact.jpg`

Services detail sheets:
- `svc_consult.jpg`
- `svc_imaging.jpg`
- `svc_lab.jpg`
- `svc_prevent.jpg`
- `svc_pharmacy.jpg`
- `svc_homecare.jpg`

Careers detail sheets:
- `car_doctors.jpg`
- `car_nursing.jpg`
- `car_admin.jpg`
- `car_labtech.jpg`
- `car_radiology.jpg`
- `car_intern.jpg`

If an image is missing or fails to load, the sheet shows a fallback color and logs a warning.

## Mock image download

To attempt downloading the stock mock images into `public/assets/images/`:

```bash
npm run mock:images
```

If a download fails, the script writes a placeholder image so the app always has local assets. Runtime never loads remote URLs.

## Replace content or add pages

- Edit `src/content/pages.js` to update copy, images, or add pages.
- The slider labels and main sheets come from `mainPages` in that file.
- Detail carousels are defined in `detailPages` for `services` and `careers`.

## Project structure

- `src/main.js` bootstraps the scene and interaction
- `src/content/pages.js` stores corridor and detail content
- `src/scene/createScene.js` sets fog + lighting
- `src/scene/createCorridor.js` builds the corridor
- `src/scene/createSheets.js` builds the main sheets
- `src/scene/imageTexture.js` loads image textures
- `src/controls/cameraRail.js` handles camera tweens
- `src/ui/slider.js` renders the corridor slider
- `src/ui/detailUI.js` renders the detail mode UI
- `src/state/appState.js` stores interaction mode
