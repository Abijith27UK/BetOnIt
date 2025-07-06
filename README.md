# 🎲 BetOnIt

**BetOnIt** is a real-time betting platform offering two interactive games—Plinko and live sports betting—along with full-featured user management and real-time updates via WebSockets.

---

## 🧭 Table of Contents

1. [Core Features](#core-features)  
2. [Tech Stack & Architecture](#technical-architecture)  
3. [Getting Started](#getting-started) 

---

## 🎯 Core Features

- **Plinko Game**:  
  A browser-based, physics-driven Plinko experience using dynamic canvas rendering.

- **Live Sports Betting**:  
  - Displays real-time odds.  
  - Users can place bets on various sports events.  
  - Immediate bet resolution once match concludes.

- **User Management**:  
  - Sign up, login/logout, password reset.  
  - Personalized dashboard showing bet history & wallet balance.  
  - Profile editing functions.

- **Real-Time Communication**:  
  - WebSocket-powered front-to-back updates for live odds, bet status, results, and chat.

---

## 🏗 Technical Architecture

### Frontend  
- **React 18** + **TypeScript**  
- **Vite**: fast dev bundler  
- **Tailwind CSS** + **Material‑UI**: design & component library

### Backend  
- **Node.js** + **Express** + **TypeScript**  
- **Socket.io**: WebSocket layer  
- **MongoDB**: stores user profiles, matches, bets

### Data Models  
- `User` schema: authentication, profile, wallet, bet history  
- `Match` schema: teams, odds, start/end times, result statuses

---

## 🚀 Getting Started

### Prerequisites  
- [Node.js](https://nodejs.org/) (v14+)  
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)  
- [MongoDB](https://www.mongodb.com/) instance (local or cloud)

### Installation

```bash
git clone https://github.com/Abijith27UK/BetOnIt.git
cd BetOnIt

# Backend
cd server
cp .env.example .env
# configure MONGODB_URI, JWT_SECRET, etc.
npm install
npm run dev

# Frontend (in new terminal)
cd ../client
npm install
npm run dev
