<div align="center">

# BharatANPR

### Next-Generation Automatic Number Plate Recognition System

**Built for Smart India Hackathon 2026**

[![Live Demo](https://img.shields.io/badge/Live_Demo-BharatANPR-FF9933?style=for-the-badge)](https://sih2026-ashen.vercel.app/)
[![Smart India Hackathon](https://img.shields.io/badge/Smart_India_Hackathon-2026-138808?style=for-the-badge)](#)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](#)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](#)
[![Vite](https://img.shields.io/badge/Vite-Fast-646CFF?style=for-the-badge&logo=vite&logoColor=white)](#)

```
   ____  __                     __      ___    _   ______  ____ 
  / __ )/ /_  ____ __________ _/ /_    /   |  / | / / __ \/ __ \
 / __  / __ \/ __ `/ ___/ __ `/ __/   / /| | /  |/ / /_/ / /_/ /
/ /_/ / / / / /_/ / /  / /_/ / /_    / ___ |/ /|  / ____/ _, _/ 
/_____/_/ /_/\__,_/_/   \__,_/\__/   /_/  |_/_/ |_/_/   /_/ |_|
```

**Intelligent. Scalable. India-ready.**

*A next-generation Automatic Number Plate Recognition platform engineered
for real-world traffic intelligence, surveillance, and smart-city applications.*

**[Open Live Application](https://sih2026-ashen.vercel.app/)**

</div>

---

## 01. Overview

### What is BharatANPR?

BharatANPR is an intelligent **Automatic Number Plate Recognition (ANPR)** platform designed to address real-world traffic monitoring, vehicle identification, and surveillance challenges.

The system combines a high-performance processing architecture with a modern interactive dashboard to create a platform that is:

- Fast
- Accuracy-focused
- Scalable
- India-oriented
- Modular
- Designed for real-world interaction

Rather than behaving like a conventional administration dashboard, BharatANPR treats the interface as part of the product itself — combining **Data Visualization**, **Motion Physics**, **Spatial Depth**, **Intelligent Processing**, and **Indian Visual Identity**.

---

## 02. Core Experience

<table>
<tr>
<td width="50%" valign="top">

### Automatic Number Plate Recognition
Detect and process vehicle number plates through an architecture designed around automated recognition workflows.

</td>
<td width="50%" valign="top">

### Intelligent Dashboard
A responsive visualization layer designed to make traffic, vehicle, and surveillance data easier to understand.

</td>
</tr>
<tr>
<td width="50%" valign="top">

### Modular Architecture
Frontend, backend, database, and processing layers remain separated for easier development, maintenance, and scaling.

</td>
<td width="50%" valign="top">

### Physics-Driven Interface
Interactive UI elements use spring physics, parallax, cursor tracking, and micro-interactions instead of generic CSS transitions.

</td>
</tr>
</table>

---

## 03. Design Philosophy

### Antigravity Light Mode

BharatANPR deliberately avoids the typical dark background, neon colors, glowing AI dashboard aesthetic.

Instead, the interface follows a custom visual language built around:

> **Light. Space. Motion. Physics. Identity.**

#### Spatial Depth Over Dark Mode

The interface uses:

- Pure white surfaces
- Frosted pearl backgrounds
- Subtle glassmorphism
- Layered transparency
- Soft depth cues
- Minimal shadows
- Controlled gradients
- Generous whitespace

There is zero dependence on dark mode to create visual depth.

#### Physics-Based Interaction

Traditional UI interactions such as:

```css
transition: all 0.3s ease;
```

are **not** the primary interaction model. Instead, the interface uses **Framer Motion** and physics-inspired animation principles to create interactions that feel physical and responsive.

**Interaction System**
- Magnetic cursor attraction
- Spring-based movement
- Cursor tracking
- 3D parallax tilt
- Physical recoil
- Smooth page transitions
- Micro-interactions
- Spatial depth mapping
- Gesture-based feedback
- Motion-aware UI states

> The goal is simple: the interface should feel like it has weight.

---

## 04. Visual Identity

### Color System

| Element      | Value     | Purpose          |
|--------------|-----------|-------------------|
| Background   | `#FFFFFF` | Pure White        |
| Surface      | `#F8F9FA` | Frosted Pearl      |
| Primary      | `#FF9933` | Saffron            |
| Secondary    | `#138808` | India Green        |
| Typography   | `#000080` | Ashoka Navy        |
| Accent       | `#FFD700` | Gold                |

The primary visual gradient draws inspiration from the Indian tricolor while remaining subtle enough for a professional technology product. The color system is intentionally restrained to prevent the interface from becoming visually noisy.

---

## 05. System Architecture

```
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
```

### Architecture Philosophy

The repository follows a separation-of-concerns approach. The frontend visualization layer, backend processing services, and database infrastructure are maintained as distinct layers.

```
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
```

This structure allows individual layers to evolve independently while maintaining a clean and scalable architecture.

---

## 06. Technology Stack

| Layer       | Technology              | Purpose                            |
|-------------|--------------------------|--------------------------------------|
| Core        | React 18                | Component-based UI                  |
| Build       | Vite                     | High-speed development and bundling |
| Language    | TypeScript               | Type safety and maintainability     |
| Styling     | Tailwind CSS             | Utility-first design system         |
| Utilities   | clsx / tailwind-merge     | Dynamic class management            |
| Motion      | Framer Motion             | Physics-based interactions          |
| Routing     | React Router DOM          | Client-side navigation              |
| Database    | Supabase                  | Data and backend infrastructure     |
| Deployment  | Vercel                    | Frontend deployment                 |

---

## 07. Project Structure

```
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
```

---

## 08. Getting Started

Want to run BharatANPR locally? Follow the steps below.

**01 — Clone the Repository**
```bash
git clone https://github.com/codingyash9-bit/SIH.git
cd SIH
```

**02 — Initialize the Frontend**
```bash
cd dashboard
npm install
```

**03 — Start the Development Server**
```bash
npm run dev
```

The dashboard will be available at:

```
http://localhost:5173
```

---

## 09. Live Application

<div align="center">

### Experience BharatANPR

**[Launch Live Application](https://sih2026-ashen.vercel.app/)**

https://sih2026-ashen.vercel.app/

*Built for Smart India Hackathon 2026*

</div>

---

## 10. Project Vision

BharatANPR is more than a number-plate recognition interface. The long-term vision is to create a platform capable of supporting:

- Smarter traffic infrastructure
- Automated vehicle identification
- Surveillance workflows
- Traffic monitoring
- Data-driven transportation systems
- Intelligent urban mobility
- Scalable ANPR infrastructure

The project focuses on combining:

> **Computer Vision + Intelligent Processing + Real-Time Data + Human-Centered Design = Smart Traffic Intelligence**

---

## 11. Why BharatANPR?

Traditional traffic monitoring systems often separate complex data from the people who need to understand it. BharatANPR approaches the problem differently, built around three fundamental principles:

**Performance**
Build an interface and architecture capable of handling high-volume traffic intelligence workflows.

**Clarity**
Transform complex vehicle and surveillance data into information that can be understood quickly.

**Experience**
Create an interface that feels modern, responsive, physical, and memorable rather than looking like a generic administration dashboard.

---

## 12. Design Principles

| # | Principle |
|---|-----------|
| 01 | Minimalism |
| 02 | Spatial Depth |
| 03 | Physics-Based Motion |
| 04 | Visual Hierarchy |
| 05 | Information Clarity |
| 06 | Responsive Interaction |
| 07 | Indian Visual Identity |
| 08 | Scalable Architecture |

> Every visual decision is intended to support the same principle: technology should feel powerful without feeling complicated.

---

## 13. Team

<div align="center">

### Syntax Syndicate
**Smart India Hackathon 2026**

| Member |
|--------|
| Yash Mahadeshvar |
| Varun Kumar Pamula |
| Herschel Valecha |
| Tarjani Pastagia |
| Aayushi Prajapati |
| Khusbu Poptani |

</div>

---

## 14. Contribution

Contributions, suggestions, and improvements are welcome. If you discover an issue or have an idea for improving BharatANPR, feel free to open an issue or submit a pull request.

---

## 15. License

This project was developed as part of Smart India Hackathon 2026 by Team Syntax Syndicate.

---

<div align="center">

### BharatANPR
*Intelligent Traffic. Indian Context. Modern Technology.*

Built with code. Designed with purpose.

**BharatANPR · Syntax Syndicate · SIH 2026**

If you found this project interesting, consider giving the repository a star.

</div>
