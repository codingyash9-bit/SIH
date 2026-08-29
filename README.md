<div align="center">

```text
    ____  __                     __      ___    _   ______  ____ 
   / __ )/ /_  ____ __________ _/ /_    /   |  / | / / __ \/ __ \
  / __  / __ \/ __ `/ ___/ __ `/ __/   / /| | /  |/ / /_/ / /_/ /
 / /_/ / / / / /_/ / /  / /_/ / /_    / ___ |/ /|  / ____/ _, _/ 
/_____/_/ /_/\__,_/_/   \__,_/\__/   /_/  |_/_/ |_/_/   /_/ |_|

Next-Generation Automatic Number Plate Recognition System

Developed for Smart India Hackathon 2026

Live Application Access: https://sih2026-ashen.vercel.app/

+++ SYSTEM OVERVIEW
BharatANPR is an intelligent, highly scalable Automatic Number Plate Recognition platform engineered to solve real-world traffic and surveillance challenges. Built with a focus on speed, accuracy, and accessibility, the system features a custom-built, physics-driven interface designed to feel lightweight, physical, and premium.

The repository is modularly structured to ensure clean separation of concerns between the high-performance visualization dashboard and the backend processing services.

+++ DESIGN PHILOSOPHY: ANTIGRAVITY LIGHT MODE
To distinguish this project from generic dashboard templates, the frontend was engineered using a custom visual language that merges premium SaaS aesthetics with a subtle Indian visual identity.

Spatial Depth over Dark Mode: The UI relies entirely on frosted glassmorphism layered over pure white and pearl backgrounds. There is zero reliance on dark mode or heavy shadows.

Physics-Based Interaction: Traditional linear CSS transitions are replaced with Framer Motion spring physics. Elements feature magnetic cursor pulls, 3D parallax tilt mapping, and physical recoil on release.

Thematic Palette:

Base: Pure White (#FFFFFF) & Frosted Pearl (#F8F9FA)

Primary Action: Saffron (#FF9933) to India Green (#138808) gradients

Typography: Ashoka Navy Blue (#000080)

Accents: Gold (#FFD700)

+++ SYSTEM ARCHITECTURE
Plaintext
d:\BharatANPR\
├── dashboard\                <-- Current Frontend (Vite + React / TypeScript)
│   ├── src\                  <-- Source Code (Components, Pages, Motion Logic)
│   ├── index.html            <-- Entry Point
│   ├── package.json          <-- Frontend Dependencies
│   └── vite.config.ts        <-- Vite Configuration
├── backend\                  <-- Backend Services & ANPR Processing
├── supabase\                 <-- Database / Supabase configuration
└── README.md                 <-- System Documentation
+++ TECHNOLOGY STACK
Layer	Technologies	Purpose
Core Framework	React 18, Vite, TypeScript	High-performance component rendering and type safety.
Styling Engine	Tailwind CSS, clsx, tailwind-merge	Utility-first styling for the frosted glass UI.
Motion Physics	Framer Motion	Spring-based animations, 3D tilt calculations, and cursor tracking.
Routing	React Router DOM	Client-side navigation for sub-pages.
Deployment	Vercel	Edge-network hosting for the frontend dashboard.
+++ LOCAL DEPLOYMENT GUIDE
To run the BharatANPR dashboard locally for development or demonstration purposes, execute the following commands in your terminal.

1. Clone the repository

Bash
git clone [https://github.com/codingyash9-bit/SIH.git](https://github.com/codingyash9-bit/SIH.git)
cd SIH
2. Initialize the Frontend Environment

Bash
cd dashboard
npm install
3. Launch the Development Server

Bash
npm run dev
The application will now be accessible at http://localhost:5173.

+++ TEAM Syntax Syndicate 
Yash Mahadeshvar 
Varun Kumar Pamula
Herschel Valecha
Tarjani Pastagia
Aayushi Prajapati
Khusbu Poptani
[Teammate 5 Name] - [Role]

[Teammate 6 Name] - [Role]
