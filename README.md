# Chatr. - The Ultimate Social Media Chat App

![Version](https://img.shields.io/badge/version-1.1.0-blue.svg)
![Author](https://img.shields.io/badge/author-Pranav%20Sharma-orange.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Status](https://img.shields.io/badge/status-DevOps%20Ready-success.svg)

**Chatr.** is a high-performance, real-time social messaging application featuring a premium "Namaste" Indian touch. Built for scale, it integrates a sophisticated MERN stack with Redis Pub/Sub for horizontal scaling and is fully orchestrated with Docker and Kubernetes.

---

## 🚀 Key Features

### 🇮🇳 Friendly "Indian Touch" UI
- **Namaste Greetings**: Welcoming users with cultural warmth on login and home screens.
- **Localized Copy**: Social-media-friendly terminology (e.g., "Join the Conversation", "Online", "Secure Connection").
- **Real-time Search**: Live filtering of friends in the sidebar with instant highlighting.

### 💎 Premium Glassmorphism UI/UX
- **Obsidion Design System**: 32px blur panels, high-fidelity gradients, and volt-glow micro-interactions.
- **Fluid Layouts**: Asymmetric chat bubbles and optimized Framer Motion transitions.

### 🏗️ Scalable Infrastructure (DevOps)
- **Redis Pub/Sub**: Integrated Socket.io Redis adapter for multi-instance scaling and global state management.
- **Docker Orchestration**: Multi-stage production builds with separate environments for Development and Production.
- **Kubernetes Ready**: Full manifest suite (Deployments, Services, ConfigMaps, Secrets, PVCs) for local Minikube or Cloud (GKE) deployments.
- **Health Monitoring**: Built-in `/api/health` endpoints for orchestration readiness.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, TailwindCSS, Zustand, Framer Motion
- **Backend**: Node.js, Express, Socket.io (with Redis Adapter)
- **Database**: MongoDB (Mongoose)
- **Cache/PubSub**: Redis
- **Infra**: Docker, Docker Compose, Kubernetes (Minikube)

---

## ⚡️ Quick Start (Local Docker)

### Prerequisites
- Docker & Docker Compose
- Node.js 18+ (for local scripts)

### Installation & Run

1. **Clone the repository**
   ```bash
   git clone https://github.com/Pranav-exe/Chatr..git
   cd Chatr.
   ```

2. **Setup Environment**
   Copy the example environment template:
   ```bash
   cp server/.env.example server/.env
   # Open .env and add your MONGO_DB_URI and a secure JWT_SECRET
   ```

3. **Spin up with Docker Compose**
   ```bash
   # Development Mode (Hot Reload)
   docker compose up --build

   # Production Mode
   docker compose -f docker-compose.prod.yml up --build
   ```

---

## ☸️ Kubernetes Deployment (Minikube)

1. **Start Minikube**
   ```bash
   minikube start
   ```

2. **Connect Docker to Minikube**
   ```bash
   eval $(minikube docker-env)
   ```

3. **Build Images**
   ```bash
   docker build -t chatr-backend:k8s ./server
   docker build -t chatr-client:k8s -f ./client/Dockerfile .
   ```

4. **Apply Manifests**
   ```bash
   kubectl apply -f kubernetes/
   ```

---

## 👨‍💻 Developer

**Pranav Sharma**
- *Full Stack Engineer & DevOps Enthusiast*
- Building scalable architectures with a premium touch.

---

© 2026 Pranav Sharma. All Rights Reserved.
