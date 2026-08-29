<div align="center">

# BHARATANPR

### Next-Generation Automatic Number Plate Recognition System

**Built for Smart India Hackathon 2026**

<br>

[![Live Demo](https://img.shields.io/badge/Live_Demo-BharatANPR-FF9933?style=for-the-badge)](https://sih2026-ashen.vercel.app/)
[![Smart India Hackathon](https://img.shields.io/badge/Smart_India_Hackathon-2026-138808?style=for-the-badge)](#)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](#)
[![Vite](https://img.shields.io/badge/Vite-Fast-646CFF?style=for-the-badge&logo=vite&logoColor=white)](#)

<br>

```text
    ____  __                     __      ___    _   ______  ____ 
   / __ )/ /_  ____ __________ _/ /_    /   |  / | / / __ \/ __ \
  / __  / __ \/ __ `/ ___/ __ `/ __/   / /| | /  |/ / /_/ / /_/ /
 / /_/ / / / / /_/ / /  / /_/ / /_    / ___ |/ /|  / ____/ _, _/ 
/_____/_/ /_/\__,_/_/   \__,_/\__/   /_/  |_/_/ |_/_/   /_/ |_|


Intelligent. Scalable. India-ready.

A next-generation Automatic Number Plate Recognition platform engineered
for real-world traffic intelligence, surveillance, and smart-city applications.

<br>

OPEN LIVE APPLICATION

</div>
01. OVERVIEW
What is BharatANPR?

BharatANPR is an intelligent Automatic Number Plate Recognition (ANPR) platform designed to address real-world traffic monitoring, vehicle identification, and surveillance challenges.

The system combines a high-performance processing architecture with a modern interactive dashboard to create a platform that is:

Fast
Accuracy-focused
Scalable
India-oriented
Modular
Designed for real-world interaction

Rather than behaving like a conventional administration dashboard, BharatANPR treats the interface as part of the product itself.

The platform combines:

Data Visualization + Motion Physics + Spatial Depth + Intelligent Processing + Indian Visual Identity

02. CORE EXPERIENCE
<table> <tr> <td width="50%" valign="top">
Automatic Number Plate Recognition

Detect and process vehicle number plates through an architecture designed around automated recognition workflows.

</td> <td width="50%" valign="top">
Intelligent Dashboard

A responsive visualization layer designed to make traffic, vehicle, and surveillance data easier to understand.

</td> </tr> <tr> <td width="50%" valign="top">
Modular Architecture

Frontend, backend, database, and processing layers remain separated for easier development, maintenance, and scaling.

</td> <td width="50%" valign="top">
Physics-Driven Interface

Interactive UI elements use spring physics, parallax, cursor tracking, and micro-interactions instead of generic CSS transitions.

</td> </tr> </table>
03. DESIGN PHILOSOPHY
ANTIGRAVITY LIGHT MODE

BharatANPR deliberately avoids the typical:

Dark Background + Neon Colors + Glowing AI Dashboard

aesthetic.

Instead, the interface follows a custom visual language built around:

Light. Space. Motion. Physics. Identity.

Spatial Depth Over Dark Mode

The interface uses:

Pure white surfaces
Frosted pearl backgrounds
Subtle glassmorphism
Layered transparency
Soft depth cues
Minimal shadows
Controlled gradients
Generous whitespace

There is zero dependence on dark mode to create visual depth.

Physics-Based Interaction

Traditional UI interactions such as:

transition: all 0.3s ease;

are not the primary interaction model.

Instead, the interface uses Framer Motion and physics-inspired animation principles to create interactions that feel physical and responsive.

Interaction System
Magnetic cursor attraction
Spring-based movement
Cursor tracking
3D parallax tilt
Physical recoil
Smooth page transitions
Micro-interactions
Spatial depth mapping
Gesture-based feedback
Motion-aware UI states

The goal is simple:

The interface should feel like it has weight.

04. VISUAL IDENTITY
Color System
Element	Value	Purpose
Background	#FFFFFF	Pure White
Surface	#F8F9FA	Frosted Pearl
Primary	#FF9933	Saffron
Secondary	#138808	India Green
Typography	#000080	Ashoka Navy
Accent	#FFD700	Gold
Saffron to Green

The primary visual gradient draws inspiration from the Indian tricolor while remaining subtle enough for a professional technology product.

The color system is intentionally restrained to prevent the interface from becoming visually noisy.

05. SYSTEM ARCHITECTURE
BharatANPR
│
├── dashboard/
│   │
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── animations/
│   │   └── motion-logic/
│   │
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
│
├── backend/
│   └── ANPR Processing Services
│
├── supabase/
│   └── Database & Configuration
│
└── README.md
Architecture Philosophy

The repository follows a separation-of-concerns approach.

The frontend visualization layer, backend processing services, and database infrastructure are maintained as distinct layers.

                    ┌─────────────────────┐
                    │    BharatANPR UI    │
                    │ React + TypeScript  │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Backend Services  │
                    │   ANPR Processing   │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      Supabase       │
                    │ Database / Storage  │
                    └─────────────────────┘

This structure allows individual layers to evolve independently while maintaining a clean and scalable architecture.

06. TECHNOLOGY STACK
<div align="center">
Layer	Technology	Purpose
Core	React 18	Component-based UI
Build	Vite	High-speed development and bundling
Language	TypeScript	Type safety and maintainability
Styling	Tailwind CSS	Utility-first design system
Utilities	clsx / tailwind-merge	Dynamic class management
Motion	Framer Motion	Physics-based interactions
Routing	React Router DOM	Client-side navigation
Database	Supabase	Data and backend infrastructure
Deployment	Vercel	Frontend deployment
</div>
07. PROJECT STRUCTURE
SIH/
│
├── dashboard/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── animations/
│   │   └── motion-logic/
│   │
│   ├── public/
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── tsconfig.json
│   └── vite.config.ts
│
├── backend/
│
├── supabase/
│
└── README.md
08. GETTING STARTED

Want to run BharatANPR locally?

Follow the steps below.

01 — Clone the Repository
git clone https://github.com/codingyash9-bit/SIH.git
cd SIH
02 — Initialize the Frontend
cd dashboard
npm install
03 — Start the Development Server
npm run dev

The dashboard will be available at:

http://localhost:5173
09. LIVE APPLICATION
<div align="center">
Experience BharatANPR
<br>

LAUNCH LIVE APPLICATION

<br><br>

https://sih2026-ashen.vercel.app/

<br>

Built for Smart India Hackathon 2026

</div>
10. PROJECT VISION

BharatANPR is more than a number-plate recognition interface.

The long-term vision is to create a platform capable of supporting:

Smarter traffic infrastructure
Automated vehicle identification
Surveillance workflows
Traffic monitoring
Data-driven transportation systems
Intelligent urban mobility
Scalable ANPR infrastructure

The project focuses on combining:

Computer Vision
      +
Intelligent Processing
      +
Real-Time Data
      +
Human-Centered Design
      =
Smart Traffic Intelligence
11. WHY BHARATANPR?

Traditional traffic monitoring systems often separate complex data from the people who need to understand it.

BharatANPR approaches the problem differently.

The system is designed around three fundamental principles:

PERFORMANCE

Build an interface and architecture capable of handling high-volume traffic intelligence workflows.

CLARITY

Transform complex vehicle and surveillance data into information that can be understood quickly.

EXPERIENCE

Create an interface that feels modern, responsive, physical, and memorable rather than looking like a generic administration dashboard.

12. DESIGN PRINCIPLES
01  Minimalism
02  Spatial Depth
03  Physics-Based Motion
04  Visual Hierarchy
05  Information Clarity
06  Responsive Interaction
07  Indian Visual Identity
08  Scalable Architecture

Every visual decision is intended to support the same principle:

Technology should feel powerful without feeling complicated.

13. TEAM
<div align="center">
SYNTAX SYNDICATE
Smart India Hackathon 2026
<br>
Member
Yash Mahadeshvar
Varun Kumar Pamula
Herschel Valecha
Tarjani Pastagia
Aayushi Prajapati
Khusbu Poptani
</div>
14. CONTRIBUTION

Contributions, suggestions, and improvements are welcome.

If you discover an issue or have an idea for improving BharatANPR, feel free to open an issue or submit a pull request.

15. LICENSE

This project was developed as part of Smart India Hackathon 2026 by Team Syntax Syndicate.

<div align="center"> <br>
BHARATANPR
Intelligent Traffic. Indian Context. Modern Technology.
<br>

Built with code. Designed with purpose.

<br>

BharatANPR · Syntax Syndicate · SIH 2026

<br><br>

If you found this project interesting, consider giving the repository a star.

</div>
