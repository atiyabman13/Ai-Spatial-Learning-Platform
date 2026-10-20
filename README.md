# AI Spatial Learning Platform

An interactive, web-based spatial learning and remote collaboration platform that enables students and teachers to explore 3D models, learn complex concepts visually, and collaborate in a shared virtual environment — without requiring a VR headset.

**Live Demo:** [Open AI Spatial Learning Platform](https://ai-spatial-learning-platform-rcvv.vercel.app/)  
**GitHub Repository:** [Ai-Spatial-Learning-Platform](https://github.com/atiyabman13/Ai-Spatial-Learning-Platform)

---

## 📌 Project Overview

The AI Spatial Learning Platform combines 3D visualization, collaborative learning, and AI-assisted educational support in a single web application.

The platform is designed to make complex concepts easier to understand through interactive 3D models and shared learning experiences. Students can explore anatomical structures and biology topics, while teachers can support learning through dedicated portals and collaborative sessions.

The application runs in a web browser on compatible desktop and mobile devices, reducing the need for specialized VR hardware.

## ✨ Key Features

### 🧠 Interactive 3D Visualization
- Explore 3D anatomical and educational models directly in the browser.
- Rotate, zoom, and inspect models to understand their structures.
- View labeled anatomical parts to support visual learning.
- Explore educational models such as the heart, brain, respiratory system, eye, skeleton, digestive system, plant cell, DNA, and mitosis.

### 🤝 Real-Time Remote Collaboration
- Support collaborative learning sessions for multiple users.
- Synchronize supported 3D model interactions, including rotation and zoom.
- Enable real-time communication using LiveKit.
- Facilitate remote learning without requiring a VR headset.

### 🎓 Student and Teacher Portals
- Role-based student and teacher experiences.
- Dedicated dashboards for learning and classroom activities.
- Biology learning content designed for school students in Classes 6–12.
- Interactive exploration of educational models and topics.

### 🤖 AI-Assisted Learning
- AI assistant for educational questions and learning support.
- Context-aware assistance for relevant biology learning content.
- Integration points for AI-powered explanations and doubt solving.

### 🔐 Authentication and Administration
- User authentication and protected application areas.
- Dedicated administrative functionality.
- Backend services for application data and user-related operations.

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, JavaScript |
| 3D Visualization | Three.js, WebGL |
| Backend | Node.js, Express.js |
| Real-Time Communication | Socket.IO, LiveKit |
| Database | MongoDB, MongoDB Atlas |
| AI Integration | AI API integration |
| Authentication | JWT-based authentication |
| Deployment | Vercel, Render |
| Development Tools | VS Code, Git, GitHub |

## 🏗️ System Architecture

```text
             Student / Teacher
                     |
                     v
             React Web Interface
                     |
          +----------+----------+
          |                     |
          v                     v
   3D Visualization        AI Assistant
   Three.js / WebGL        AI Integration
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

## 🚀 Live Application

- **Frontend:** https://ai-spatial-learning-platform-rcvv.vercel.app/
- **Backend:** https://ai-spatial-learning-backend.onrender.com

The frontend and backend are deployed separately. Some features may require valid service configuration and environment variables.

## 💻 Getting Started

### Prerequisites

Install the following before running the project locally:

- Node.js and npm
- Git
- MongoDB Atlas account or a local MongoDB instance
- Required AI API credentials, if using AI-powered features
- LiveKit credentials, if using real-time communication

### 1. Clone the Repository

```bash
git clone https://github.com/atiyabman13/Ai-Spatial-Learning-Platform.git
cd Ai-Spatial-Learning-Platform
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Configure the Backend

```bash
cd backend
npm install
```

Create a local `.env` file in the backend directory using the environment variables required by the application.

Typical configuration may include:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_private_jwt_secret
```

Configure any additional AI and LiveKit variables required by the relevant features. Use your own credentials and never commit real secrets to GitHub.

### 4. Start the Backend

From the `backend` directory, run the start script defined in `backend/package.json`, for example:

```bash
npm start
```

If the project uses a different backend start script, follow the available scripts in `backend/package.json`.

### 5. Start the Frontend

Open a second terminal in the project root:

```bash
npm run dev
```

Open the local URL printed by Vite in your terminal.

> **Note:** Local setup may require additional environment variables or service configuration. Check the project configuration and deployment settings for the complete requirements.

## 📂 Project Structure

```text
Ai-Spatial-Learning-Platform/
├── backend/             # Express backend and API routes
├── public/              # Public assets and 3D model assets
├── src/
│   ├── components/      # Reusable React components
│   ├── pages/           # Application pages
│   ├── services/        # AI and application services
│   └── three/           # 3D visualization components and models
├── docker-compose.yml   # Local multi-service configuration
├── package.json         # Frontend dependencies and scripts
└── README.md
```

*This is a high-level overview; exact files and folders may vary with the current implementation.*

## 🎯 Project Objectives

- Make complex biological and spatial concepts easier to understand through 3D visualization.
- Enable collaborative learning from different locations.
- Provide accessible browser-based educational experiences.
- Integrate AI-assisted learning support into educational workflows.
- Reduce dependence on specialized VR equipment.

## 🔮 Future Enhancements

- Expand the collection of interactive educational models.
- Improve AI-generated explanations and contextual learning assistance.
- Add more classroom collaboration and teaching tools.
- Enhance accessibility and mobile-device usability.
- Expand testing, performance optimization, and deployment documentation.

## 👨‍💻 Development

This project is developed as an engineering major project focused on spatial computing, interactive 3D visualization, and AI-assisted education.

Contributions, suggestions, and feedback are welcome.

---

**Built with React, Three.js, Node.js, and real-time collaboration technologies.**
