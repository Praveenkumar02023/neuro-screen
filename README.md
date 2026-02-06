# NeuroScreen AI - Next.js Medical Imaging Platform

## Overview
NeuroScreen AI is a web-based automated diagnosis tool for neurological conditions (Alzheimer's, MCI, CN). It uses a modern Next.js 14 architecture with integrated API routes for backend processing.

## 🛠️ Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **Backend**: Next.js API Routes (Serverless Functions)

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure
- `src/app/page.tsx`: Main UI logic and components.
- `src/app/api/predict/route.ts`: Backend logic for handling MRI analysis (currently mocked).
- `src/app/globals.css`: Global styles and Tailwind directives.

## ✨ Features
- **Secure Processing**: Uploads are processed via secure API routes.
- **Responsive Design**: Optimized for desktops and tablets.
- **Interactive UI**: Real-time feedback and smooth animations.
