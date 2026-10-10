# OUR STORIES — South Indian Filter Coffee Website

A premium, cinematic, scroll-driven single-page website for **OUR STORIES** South Indian Filter Coffee. Built with HTML, CSS, JavaScript, GSAP, ScrollTrigger, Lenis smooth scrolling, and an interactive Canvas coffee bean physics simulation.

---

## 🌟 Key Features

1. **Section 1 — Full-Screen Hero Video**:
   - Full viewport video background with plantation atmosphere, brand logo mark, wordmark, tagline, and fixed navigation header.
   - Pushes into foliage on scroll.

2. **Section 2 — "Filter Coffee" Dripping Title**:
   - Dripping SVG organic chocolate-edge background transition from deep brown `#2A120C` to warm caramel `#C8742E`.
   - Glossy brass tumbler set in center, split by "Filter" and *"Coffee"*.
   - Headline parallax and 25 Years of Heritage stat callout.

3. **Section 3 — Pinned Brass Pour Sequence (Centerpiece)**:
   - 4-beat scroll sequence on pinned viewport:
     - **Beat 01**: *"Served in brass, as it always was."* (Tumbler resting in dabarah with steam rising)
     - **Beat 02**: *"First, a slow lift."* (Tumbler lifts up out of dabarah)
     - **Beat 03**: *"Then the metre pour."* (Tumbler tilts and high-altitude dark coffee stream pours)
     - **Beat 04**: *"Froth, and then silence."* (Stream halts, coffee settles with foam)
   - Vertical scrub indicator with tick marks `01-04` and dot progress.
   - Interactive mouse tilt on the brass tumbler set.

4. **Section 4 — "Take The Ritual Home" (Falling Beans Physics)**:
   - Smooth background color transition from caramel to clean cream `#F6EFE4`.
   - Real-time HTML5 Canvas physics of falling roasted coffee beans (depth of field, rotation, mouse collision, floor bounce).
   - Central coffee pouch (`Filter Coffee` Kraft Pouch) with mouse parallax.

5. **Section 5 — "From The Hills Of Coorg" (Arch to Full-Bleed Reveal)**:
   - Arch-masked photograph of Coorg coffee pickers that expands dynamically to fill the 100% full screen.

6. **Section 6 — Full-Screen Photo Story**:
   - Full-bleed plantation drying yard photograph with slow Ken Burns zoom and drift.
   - Dual changing text captions on scroll (*"Rooted in Coorg."* $\rightarrow$ *"Picked by hand."*).
   - Rotating circular text badge emblem (*"OUR STORIES • TRADITIONAL FILTER COFFEE • EST 2026 •"*).

7. **Section 7 — Minimal Dark Footer**:
   - Logo mark, wordmark, brand description, link columns, and Back to Top scroll trigger.

---

## 📁 Directory & Asset Structure

```
our-stories-website/
├── index.html
├── css/
│   ├── style.css
│   └── responsive.css
├── js/
│   ├── main.js
│   ├── animations.js
│   └── beans.js
├── assets/
│   ├── images/
│   │   ├── logo.png                <- Brand logo image
│   │   ├── brass-tumbler-set.png   <- Brass tumbler and dabarah set
│   │   ├── pouch.png               <- Filter Coffee Kraft pouch
│   │   ├── pickers-arch.jpg        <- Pickers photo for arch reveal
│   │   ├── pickers-full.jpg        <- Full-bleed photo story image
│   │   └── hero-plantation.jpg     <- Fallback poster image
│   └── videos/
│       └── hero-plantation.mp4     <- Hero plantation video
└── README.md
```

---

## 🛠️ How to Run Locally

You can serve the project using any local HTTP server:

### Option A: Using Node `serve`
```bash
npx -y serve -p 8080
```
Then open `http://localhost:8080` in your web browser.

### Option B: Using Python
```bash
python -m http.server 8080
```
Then open `http://localhost:8080`.

---

## 🎨 Asset Replacement Guide

You can replace any placeholder image or video by dropping your custom files into `assets/images/` or `assets/videos/`:

- **Hero Video**: Drop your MP4 video into `assets/videos/hero-plantation.mp4`.
- **Brass Set**: Drop your transparent PNG of the brass tumbler & dabarah into `assets/images/brass-tumbler-set.png`.
- **Coffee Pouch**: Drop your product pouch PNG into `assets/images/pouch.png`.
- **Arch Photo**: Drop your Coorg plantation photo into `assets/images/pickers-arch.jpg`.
- **Full Story Photo**: Drop your high-res drying yard/harvest photo into `assets/images/pickers-full.jpg`.
- **Logo**: Drop your official brand logo into `assets/images/logo.png`.
