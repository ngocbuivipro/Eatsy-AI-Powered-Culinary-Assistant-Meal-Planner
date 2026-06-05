# 🍽️ Eatsy — AI-Powered Culinary Assistant & Meal Planner

> **Eatsy** is a cross-platform mobile application that helps users decide *what to cook* based on the ingredients they already have — powered by Google Gemini AI and the Spoonacular recipe API.

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Authors](#-authors)

---

## 📖 Overview

Eatsy solves a universal everyday problem: *"What should I cook today with what I have?"*

Instead of scrolling through static recipe websites, users input the ingredients sitting in their fridge and pantry. Eatsy's AI layer — built on **Google Gemini** — processes natural language, suggests contextually relevant recipes, handles cooking Q&A, and even proposes ingredient substitutions in real time.

The app also includes a **personal pantry tracker**, **meal planning**, **diet-aware recipe filtering**, and a **conversational AI chef** that users can chat with freely.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🧠 **AI Chat Assistant** | Ask cooking questions, get substitutions, receive tips — powered by Gemini |
| 🥘 **Ingredient-Based Recipe Search** | Input available ingredients and get matching recipes via Spoonacular |
| 🛒 **Pantry Management** | Track ingredients you own; auto-suggest recipes from your pantry |
| 📅 **Meal Planning** | Plan meals by day/week and manage your personal meal schedule |
| 🔍 **Recipe Discovery** | Browse by category, filter by diet, calories, and difficulty |
| 🔐 **Authentication** | Email/password sign-up & Google OAuth sign-in |
| 👤 **User Profiles** | Manage dietary preferences, allergies, and cooking skill level |
| 🌙 **Onboarding Flow** | Personalised onboarding to capture user preferences on first launch |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **React Native** (Expo ~54) | Cross-platform mobile UI (iOS & Android) |
| **NativeWind / TailwindCSS** | Utility-first styling |
| **React Navigation** | Stack & bottom-tab navigation |
| **Zustand** | Lightweight global state management |
| **Axios** | HTTP client for API calls |
| **Expo Linear Gradient / Blur** | Visual polish and glassmorphism effects |
| **React Native Reanimated** | Smooth animations |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js + Express 5** | REST API server |
| **MongoDB + Mongoose** | Document database & ODM |
| **Google Generative AI SDK** | Gemini AI integration |
| **Spoonacular API** | Recipe data & nutrition info |
| **JWT + bcryptjs** | Authentication & password hashing |
| **Google Auth Library** | Google OAuth token verification |
| **Morgan** | HTTP request logging |

---

## 🏗️ Architecture

```
┌─────────────────────────────────┐
│        React Native App         │  ← Expo (iOS / Android / Web)
│  Screens · Navigation · Zustand │
└────────────────┬────────────────┘
                 │ REST API (Axios)
                 ▼
┌─────────────────────────────────────┐
│       Express.js Backend            │  ← Node.js + Express 5
│  Routes · Controllers · Middleware  │
└──────┬─────────────┬────────────────┘
       │             │
       ▼             ▼
┌──────────┐  ┌──────────────────────┐
│ MongoDB  │  │   External APIs      │
│ Mongoose │  │  Gemini AI           │
│ (Atlas)  │  │  Spoonacular Recipes │
│          │  │  Google OAuth        │
└──────────┘  └──────────────────────┘
```

---

## 📁 Project Structure

```
eatsy/
├── backend/
│   ├── src/
│   │   ├── app.js                  # Express app setup
│   │   ├── server.js               # Entry point
│   │   ├── config/                 # DB connection, env config
│   │   ├── middleware/             # Auth, error handling
│   │   ├── modules/
│   │   │   ├── ai-assistant/       # Gemini AI chat routes & controllers
│   │   │   ├── recipe/             # Recipe search & management
│   │   │   ├── ingredient/         # Ingredient data
│   │   │   ├── pantry/             # Pantry CRUD
│   │   │   ├── meal-planning/      # Meal plan management
│   │   │   ├── category/           # Recipe categories
│   │   │   └── user/               # User profile & auth
│   │   ├── seeds/                  # Database seed scripts
│   │   └── utils/                  # Helper utilities
│   ├── .env.example                # Environment variable template
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── api/                    # Axios API client & service calls
    │   ├── components/             # Reusable UI components
    │   ├── screens/
    │   │   ├── auth/               # Login, Register screens
    │   │   ├── home/               # Home / dashboard
    │   │   ├── chat/               # AI chat assistant screen
    │   │   ├── recipe/             # Recipe detail & browse
    │   │   ├── pantry/             # Pantry management screen
    │   │   ├── meal-planning/      # (via backend module)
    │   │   ├── profile/            # User profile & settings
    │   │   └── onboarding/         # First-launch onboarding
    │   ├── navigation/             # React Navigation setup
    │   ├── store/                  # Zustand stores (auth, etc.)
    │   ├── constants/              # App-wide constants & theme
    │   └── utils/                  # Utility functions
    ├── App.js
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js **v18+**
- npm **v9+**
- Expo CLI (`npm install -g expo-cli`)
- MongoDB Atlas account (or local MongoDB instance)
- Google Gemini API key — [Get one here](https://aistudio.google.com/app/apikey)
- Spoonacular API key — [Get one here](https://spoonacular.com/food-api)

---

### 1. Clone the repository

```bash
git clone https://github.com/ngocbuivipro/Eatsy-AI-Powered-Culinary-Assistant-Meal-Planner.git
cd Eatsy-AI-Powered-Culinary-Assistant-Meal-Planner
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Copy the environment template and fill in your values:

```bash
cp .env.example .env
```

> See [Environment Variables](#-environment-variables) for the full list of required keys.

Start the development server:

```bash
npm run dev
```

The API will be available at `http://localhost:5050`

*(Optional) Seed the database with sample data:*

```bash
npm run seed
```

---

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Start the Expo development server:

```bash
npm start
```

Then press:
- `a` — open on Android emulator / device
- `i` — open on iOS simulator (macOS only)
- `w` — open in web browser

> **Note:** The frontend connects to the backend via the `API_BASE_URL` configured in `src/api/`. Update this to point to your backend's IP/URL if running on a physical device.

---

## 🔑 Environment Variables

All environment variables are configured in `backend/.env`. Create this file from the provided template:

```bash
cp backend/.env.example backend/.env
```

| Variable | Required | Description |
|---|:---:|---|
| `PORT` | ✅ | Port the Express server listens on (default: `5050`) |
| `MONGO_URI` | ✅ | MongoDB connection string (Atlas URI or `mongodb://localhost:27017/eatsy`) |
| `JWT_SECRET` | ✅ | Secret key for signing JSON Web Tokens — use a long random string |
| `GEMINI_API_KEY` | ✅ | Google Gemini API key for the AI chat assistant |
| `SPOONACULAR_API_KEY` | ✅ | Spoonacular API key for recipe search & data |
| `GOOGLE_CLIENT_ID` | ⚠️ | Google OAuth client ID (required for Google Sign-In) |
| `USE_MOCK_DATA` | ❌ | Set to `true` to use local mock data instead of live API calls (dev only) |

---

## 📡 API Endpoints

Base URL: `http://localhost:5050/api`

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/user/register` | Register a new user |
| `POST` | `/user/login` | Login with email & password |
| `POST` | `/user/google` | Login / register via Google OAuth |
| `GET` | `/user/profile` | Get current user's profile |
| `PUT` | `/user/profile` | Update user preferences |
| `GET` | `/recipe` | Browse & search recipes |
| `GET` | `/recipe/:id` | Get recipe details |
| `GET` | `/category` | List recipe categories |
| `POST` | `/ai-assistant/chat` | Send a message to the Gemini AI chef |
| `GET` | `/ingredient` | Search ingredient database |

> 🔒 Most endpoints require a valid JWT token in the `Authorization: Bearer <token>` header.

---

## 👥 Authors

| Name | Role |
|---|---|
| **Ngoc Bui** | System Architecture, Backend Development, and AI Integration |
| **Vũ Thị Thanh Mai** | UI/UX Design and Frontend Development |
| **Đỗ Thị Chúc Vy** | Frontend UI Implementation and Screen Design |

*Developed as a final project for the SS2 course — FIT, CLC03.*

---

## 📄 License

This project is developed for **academic purposes** as part of the SS2 course at FIT.

---

<p align="center">
  Made with hand by the Eatsy team · FIT SS2 CLC03
</p>
