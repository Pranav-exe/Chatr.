# Chatr 💬 — Production-Grade GitOps & CI/CD Orchestration on GKE

![License](https://img.shields.io/badge/license-MIT-green.svg)
![Status](https://img.shields.io/badge/status-DevOps%20Ready-success.svg)

**Chatr** is a real-time, three-tier chat application built with a full TypeScript stack (React, Node.js/Express, Socket.io, MongoDB, Redis). While the application itself is fully functional and supports real-time messaging, the primary goal of this project was to serve as a comprehensive sandbox to implement and showcase a **production-grade DevOps engineering stack** using **Kubernetes (GKE), GitOps (ArgoCD), and Keyless CI/CD Pipelines (GitHub Actions + WIF)**.

---

## 🏗️ Architecture & Deployment Flow


┌──────────────┐          ┌─────────────────┐          ┌─────────────┐
│  Local Code  ├─────────►│  GitHub Actions ├─────────►│ GCP Artifact│
│ (push main)  │          │  (Build & Tag)  │          │  Registry   │
└──────────────┘          └────────┬────────┘          └─────────────┘
│
▼
┌──────────────┐          ┌─────────────────┐          ┌──────────────┐
│  Live App    │◄─────────┤     ArgoCD      │◄─────────┤ Helm Values  │
│  (GKE Pod)   │          │  (GitOps Sync)  │          │  (yq Update) │
└──────────────┘          └─────────────────┘          └──────────────┘

1. **Push to main** — Developer pushes code changes to the `main` branch.
2. **GitHub Actions CI/CD** — Authenticates to GCP via Workload Identity Federation (keyless, zero stored credentials). Builds multi-arch images using Docker BuildKit (`docker buildx`) tagged with the Git commit SHA. Pushes to Google Artifact Registry.
3. **Automated GitOps Trigger** — Pipeline uses `yq` to update image tags in `values-dev.yaml` / `values-prod.yaml` and commits back to Git.
4. **ArgoCD Sync** — ArgoCD detects the Git change and automatically syncs the updated Helm release to the GKE cluster.
5. **Ingress & Routing** — Nginx Ingress Controller routes traffic using `nip.io` wildcard DNS.

---

## 🛠️ Tech Stack

### Application

| Layer | Technology |
|---|---|
| Frontend | React 18, TypeScript, TailwindCSS, Zustand, Framer Motion |
| Backend | Node.js, Express, TypeScript |
| Real-time | Socket.io with Redis Pub/Sub adapter |
| Auth | JWT (JSON Web Tokens), HTTP-only cookies |
| Database | MongoDB with Mongoose ODM (StatefulSet + PVC) |
| Cache / Broker | Redis (Pub/Sub for horizontal Socket.io scaling) |

### DevOps & Cloud

| Tool | Purpose |
|---|---|
| Google Kubernetes Engine (GKE) | Managed Kubernetes cluster |
| Helm v3 | Kubernetes package management, env-specific values files |
| ArgoCD | GitOps continuous delivery, automated cluster sync |
| GitHub Actions | CI/CD pipeline — build, scan, push, deploy |
| Workload Identity Federation | Keyless GCP auth from GitHub Actions (OIDC/STS) |
| Google Artifact Registry | Private container image registry |
| Nginx Ingress Controller | Cluster ingress, WebSocket routing |
| Horizontal Pod Autoscaler | CPU/Memory-based autoscaling |
| Trivy | Container vulnerability scanning in CI pipeline |
| Terraform | GKE cluster provisioning (IaC) |

---

## 🔒 DevOps Engineering Highlights

### 🔑 1. Keyless Authentication via Workload Identity Federation
Instead of storing long-lived GCP service account JSON keys in GitHub Secrets, this project implements WIF. GitHub Actions presents a short-lived OIDC token to Google's Security Token Service (STS), which is exchanged for a 1-hour GCP credential. **Zero risk of leaked private key files.**

### 🔄 2. Dynamic GitOps Tagging with `yq`
Avoids mutable `:latest` tags — which cause Kubernetes cache failures and untraceable builds. The pipeline uses `yq` to surgically update nested Helm values files with the exact Git commit SHA on every build, ensuring clean versioning and a full audit trail.

### 🛡️ 3. Externalized Secret Management
All production secrets (JWT signing keys, MongoDB credentials) are fully externalized from Git. Helm templates use a conditional check (`{{- if not .Values.secrets.existingSecretName }}`) to skip plain-text secret generation. Secrets are pre-provisioned directly on the cluster under the `chatr` namespace.

### 🔌 4. WebSocket Routing Through Nginx Ingress
Configured Nginx Ingress with explicit WebSocket upgrade headers (`Upgrade`, `Connection`) to correctly proxy Socket.io long-lived connections through the ingress layer — a non-trivial real-world networking challenge in Kubernetes.

### 📈 5. High-Availability Autoscaling
HPAs configured for both Nginx and backend deployments with CPU threshold at `70%` and memory at `80%`, with `maxReplicas: 2` hard caps to protect billing limits on `e2-small` nodes.

---

## 📁 Repository Structure

Chatr/
├── .github/workflows/      # GitHub Actions CI/CD pipeline
├── Helm/                   # Helm chart
│   ├── templates/          # Kubernetes manifest templates
│   ├── values.yaml         # Base values
│   ├── values-dev.yaml     # Dev environment overrides
│   └── values-prod.yaml    # Prod environment overrides
├── argocd/                 # ArgoCD Application manifests
├── client/                 # React + TypeScript frontend
├── server/                 # Node.js + Express + TypeScript backend
├── k8s/                    # Raw Kubernetes manifests (pre-Helm)
├── nginx/                  # Nginx config
├── scripts/                # Utility shell scripts
├── docker-compose.yml      # Local development stack
└── docker-compose.prod.yml # Production Docker Compose

---

## 🚀 Run Locally

Spin up the full stack (React, Express, MongoDB, Redis) locally with Docker Compose:

```bash
git clone https://github.com/Pranav-exe/Chatr..git
cd Chatr.
cp server/.env.example server/.env
# Add your MONGO_URI and JWT_SECRET to .env
docker compose up --build
```

App runs at `http://localhost:5173`

---

## 👨‍💻 Connect

Actively seeking **Cloud / DevOps Engineering** roles.

- **GitHub:** [Pranav-exe](https://github.com/Pranav-exe)
- **LinkedIn:** [Pranav Sharma](https://www.linkedin.com/in/pranavsharrma)
- **Email:** sharmapranav2003@gmail.com

---

© 2026 Pranav Sharma. All Rights Reserved.
