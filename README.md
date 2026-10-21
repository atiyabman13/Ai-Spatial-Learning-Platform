# AI Spatial Learning Platform

An interactive, web-based spatial learning and remote collaboration platform that lets students and teachers explore 3D models, learn complex concepts visually, and collaborate in a shared virtual environment, without needing a VR headset.

**Live Demo:** [Open AI Spatial Learning Platform](https://ai-spatial-learning-platform-rcvv.vercel.app/)
**Backend API:** [ai-spatial-learning-backend.onrender.com](https://ai-spatial-learning-backend.onrender.com)

---

## 📌 Overview

The platform combines 3D visualization, real-time collaboration and AI-assisted learning in one web application. Students can explore anatomy and biology models, while teachers can run collaborative sessions through dedicated portals. It runs in the browser on desktop and mobile.

## ✨ Features

### 🧠 Interactive 3D Visualization
- Explore 3D educational models in the browser: heart, brain, respiratory system, eye, skeleton, digestive system, plant cell, DNA and mitosis.
- Rotate, zoom and inspect models, with labeled anatomical parts.

### 🤝 Real-Time Collaboration
- Multi-user sessions with synchronized model interaction (rotation, zoom) over Socket.IO.
- Live audio/video communication using LiveKit.

### 🎓 Student and Teacher Portals
- Role-based dashboards for students and teachers.
- Biology content aimed at school students in Classes 6-12.

### 🤖 AI-Assisted Learning
- AI assistant for doubt solving and explanations, powered by Grok (xAI).
- Document support: PDF viewing (`react-pdf`, `pdfjs-dist`) and OCR from images (`tesseract.js`).

### 🔐 Authentication and Administration
- User authentication and protected routes.
- Admin functionality and backend services for user and application data.

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React 19, Vite, React Router, Framer Motion |
| 3D | Three.js, React Three Fiber, Drei |
| Backend | Node.js, Express.js |
| Real-time | Socket.IO, LiveKit |
| Database | MongoDB (Atlas or local) |
| AI | Grok (xAI API) |
| Auth and services | JWT, Firebase SDK |
| Deployment | Vercel (frontend), Render (backend), Docker + Nginx |
| Mobile packaging | Capacitor (config included) |
| Tooling | ESLint, Git, GitHub |

## 🏗️ Architecture

```
             Student / Teacher
                     |
                     v
             React Web Interface
                     |
          +----------+----------+
          |                     |
          v                     v
   3D Visualization        AI Assistant
   Three.js / R3F          Grok API
          |                     |
          +----------+----------+
                     |
                     v
             Node.js / Express
                     |
          +----------+----------+
          |                     |
          v                     v
       MongoDB          Real-Time Services
                        Socket.IO / LiveKit
```

## 💻 Getting Started

### Prerequisites
- Node.js and npm
- Git
- A MongoDB Atlas account or a local MongoDB instance
- Grok (xAI) API key (for AI features)
- LiveKit credentials (for real-time communication)
- Docker and Docker Compose (optional, for the containerized setup)

### Option A: Run locally

**1. Clone the repository**
```bash
git clone https://github.com/atiyabman13/Ai-Spatial-Learning-Platform.git
cd Ai-Spatial-Learning-Platform
```

**2. Install frontend dependencies**
```bash
npm install
```

**3. Set up the backend**
```bash
cd backend
npm install
```
Create a `.env` file in `backend/`:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_private_jwt_secret
```
Add your AI and LiveKit variables as required. Never commit real secrets.

**4. Start the backend** (from `backend/`)
```bash
npm start
```
If your backend uses a different script, check `backend/package.json`.

**5. Start the frontend** (from the project root, in a second terminal)
```bash
npm run dev
```
Open the local URL that Vite prints.

### Option B: Run with Docker

`docker-compose.yml` starts three services:

| Service | Description | Port |
|---|---|---|
| `mongodb` | MongoDB 7 with a persistent volume | 27017 |
| `backend` | Express + Socket.IO API | 5000 |
| `frontend` | Nginx serving the built app and proxying to the backend | 80 |

```bash
docker compose up --build
```
Then open `http://localhost`. Set `JWT_SECRET` and any other secrets via your own environment or an env file; do not use the placeholder values in production.

### Frontend scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

## 📱 Mobile (Capacitor)

`capacitor.config.json` is set up to wrap the built web app (`dist/`) as a mobile app. To use it, install the Capacitor packages, run `npm run build`, then sync and open the native project with the Capacitor CLI.

## 📂 Project Structure

```
Ai-Spatial-Learning-Platform/
├── backend/               # Express backend, API routes, Socket.IO
├── public/                # Static assets and 3D model files
├── src/                   # React frontend (components, pages, services, 3D)
├── test_samples/          # Sample files for testing
├── Dockerfile             # Frontend image (build + Nginx)
├── docker-compose.yml     # MongoDB + backend + frontend
├── nginx.conf             # Nginx configuration
├── capacitor.config.json  # Mobile packaging config
├── vercel.json            # Vercel deployment config
├── vite.config.js         # Vite config
├── eslint.config.js       # ESLint config
└── package.json           # Frontend dependencies and scripts
```

## 🎯 Objectives

- Make complex biological and spatial concepts easier to understand through 3D visualization.
- Enable collaborative learning across locations.
- Provide accessible, browser-based education without specialized VR hardware.
- Integrate AI-assisted learning support into the classroom workflow.

## 🔮 Future Enhancements

- More interactive educational models.
- Better AI explanations and contextual help.
- More classroom collaboration and teaching tools.
- Improved accessibility and mobile usability.
- Expanded automated testing and deployment documentation.

## 👨‍💻 Development

Built as an engineering major project focused on spatial computing, interactive 3D visualization and AI-assisted education. Feedback and contributions are welcome.

---

**Built with React, Three.js, Node.js and real-time collaboration technologies.**
