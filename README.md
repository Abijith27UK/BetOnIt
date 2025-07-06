# 🎲 BetOnIt

**BetOnIt** is a real-time betting platform offering two interactive games—Plinko and live sports betting—along with full-featured user management and real-time updates via WebSockets.

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

## 🖥 User Experience

### 🎰 Plinko Game
![Plinko](https://github.com/Abijith27UK/BetOnIt/blob/main/plinko_pic.jpg?raw=true)
- Developed a physics-based Plinko game rendered on HTML canvas.
- Features a **16-drop probability model** with realistic physics simulation.
- Integrated a **dynamic multiplier system** ranging from **0.5x to 16x**, calculated based on where the ball lands.
- User interactions are reflected instantly, simulating a real casino experience.
- Designed to be fair and engaging with randomized, physics-informed outcomes.

### 🏀 Live Sports Betting
![Betting TimeFrame](https://github.com/Abijith27UK/BetOnIt/blob/main/timeframe.png?raw=true)
![Closed](https://github.com/Abijith27UK/BetOnIt/blob/main/closed.jpg?raw=true)
- Built a **timeframe-based betting engine** with 4 match phases:
  - **Pre-Match**
  - **First Half**
  - **Second Half**
  - **Post-Match (Settled)**
- Integrated a **dynamic odds system** that updates every **2 seconds** using **Socket.IO**, allowing for multiple active matches and odds changes.
- Implemented a **risk factor model** that adjusts reward multipliers based on:
  - Current match phase
  - Selected odds
- Custom **reward calculation system** adapts based on:
  - Bet timing
  - Live odds at the moment of betting
  - Player’s betting stake and selected risk level
- Automated bet resolution:
  - Implemented using **node-cron** to check for concluded matches and trigger result processing without manual input.

### 👤 User Management
![Dashboard](https://github.com/Abijith27UK/BetOnIt/blob/main/user_dashboard.jpg?raw=true)
- Developed secure **user authentication system** (signup, login, logout).
- Created **dashboard** to see user info, manage wallet and view bet history and status.
- Built a **live transaction and balance management system**:
  - Automatically deducts stakes
  - Credits winnings upon result declaration
- **Automated result processing** for each match, integrated with betting outcomes.
- Tracks and displays **real-time bet history**, including outcomes, match details, and timestamps.

---

## 🏗 Technical Architecture

### Frontend  
- **React 18** + **TypeScript**  
- **Vite**: fast dev bundler  
- **Tailwind CSS** + **Material‑UI**: design & component library

### Backend  
- **Node.js** + **Express** + **TypeScript**  
- **Socket.io**: WebSocket layer  
- **MongoDB** with **Mongoose**: stores user profiles, matches, bets
- **Node-cron**: for periodically checking match statuses and automatically resolves bets once matches conclude

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
cd backend
cp .env.example .env
# configure MONGODB_URI, JWT_SECRET, etc.
npm install
npm run dev

# Frontend (in new terminal)
cd ../frontend
npm install
npm run dev
