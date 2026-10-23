# Chatr 💬 — Multi-Cloud GitOps & CI/CD on GKE and AWS EKS

![CI](https://github.com/Pranav-exe/Chatr./actions/workflows/ci.yml/badge.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Status](https://img.shields.io/badge/status-DevOps%20Ready-success.svg)

Chatr is a real-time, three-tier chat application built with a TypeScript stack (React, Node.js/Express, Socket.io, MongoDB, Redis). It is the project I use to practice DevOps end to end. It was first deployed on **GCP GKE** with Helm, GitOps (ArgoCD) and keyless CI/CD (GitHub Actions), then rebuilt on **AWS EKS** with Terraform infrastructure as code.

---

## ☁️ Multi-cloud deployment

The same containerized app and Helm chart have been deployed on two clouds.

| | GCP GKE (first deployment) | AWS EKS (Terraform, in `terraform/`) |
|---|---|---|
| Provisioning | Cluster set up manually | Terraform modules (VPC, EKS, IAM), remote state in S3 with locking |
| App deploy | Helm chart, ArgoCD GitOps | Helm chart (reused) |
| CI/CD | GitHub Actions with Workload Identity Federation | In progress (GitHub Actions with OIDC to AWS) |
| Cluster identity | Workload Identity | IAM roles for service accounts (IRSA) |
| Status | Torn down after the free credit ended | Built and destroyed per session to control cost |

**What carried over:** the Docker images, the Helm chart and the application architecture.
**What changed:** networking (GCP VPC vs AWS VPC with subnets and a NAT gateway), identity (Workload Identity vs IRSA), persistent storage (GCE disks vs EBS through the CSI driver), the registry and how the cluster is provisioned.

---

## 🏗️ Architecture & Deployment Flow (GKE)

```
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
```

1. **Push to main** — Developer pushes code changes to the `main` branch.
2. **GitHub Actions CI/CD** — Authenticates to GCP via Workload Identity Federation (keyless, zero stored credentials). Builds multi-arch images using Docker BuildKit (`docker buildx`) tagged with the Git commit SHA. Pushes to Google Artifact Registry.
3. **Automated GitOps Trigger** — The pipeline uses `yq` to update image tags in `values-dev.yaml` / `values-prod.yaml` and commits back to Git.
4. **ArgoCD Sync** — ArgoCD detects the Git change and automatically syncs the updated Helm release to the GKE cluster.
5. **Ingress & Routing** — Nginx Ingress Controller routes traffic using `nip.io` wildcard DNS.

The AWS EKS deployment uses the same Helm chart. Its infrastructure is provisioned by Terraform (see `terraform/README.md`), and a matching CI/CD pipeline is on the roadmap.

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
| Google Kubernetes Engine (GKE) | Managed Kubernetes on GCP |
| Amazon EKS | Managed Kubernetes on AWS |
| Terraform | AWS infrastructure as code: VPC, EKS and IAM as reusable modules |
| Amazon S3 | Terraform remote state with versioning and native locking |
| Helm v3 | Kubernetes package management, env-specific values files |
| ArgoCD | GitOps continuous delivery, automated cluster sync |
| GitHub Actions | CI/CD pipeline — build, scan, push, deploy |
| Workload Identity Federation | Keyless GCP auth from GitHub Actions (OIDC/STS) |
| Google Artifact Registry | Private container image registry (GKE) |
| Nginx Ingress Controller | Cluster ingress, WebSocket routing |
| Horizontal Pod Autoscaler | CPU/Memory-based autoscaling |
| Trivy | Container vulnerability scanning in CI pipeline |

---

## 🔒 DevOps Engineering Highlights

### 🔑 1. Keyless Authentication via Workload Identity Federation

Instead of storing long-lived GCP service account JSON keys in GitHub Secrets, this project implements WIF. GitHub Actions presents a short-lived OIDC token to Google's Security Token Service (STS), which is exchanged for a 1-hour GCP credential. Zero risk of leaked private key files.

### 🔄 2. Dynamic GitOps Tagging with `yq`

Avoids mutable `:latest` tags — which cause Kubernetes cache failures and untraceable builds. The pipeline uses `yq` to surgically update nested Helm values files with the exact Git commit SHA on every build, ensuring clean versioning and a full audit trail.

### 🛡️ 3. Externalized Secret Management

All production secrets (JWT signing keys, MongoDB credentials) are fully externalized from Git. Helm templates use a conditional check (`{{- if not .Values.secrets.existingSecretName }}`) to skip plain-text secret generation. Secrets are pre-provisioned directly on the cluster under the `chatr` namespace.

### 🔌 4. WebSocket Routing Through Nginx Ingress

Configured Nginx Ingress with explicit WebSocket upgrade headers (`Upgrade`, `Connection`) to correctly proxy Socket.io long-lived connections through the ingress layer — a non-trivial real-world networking challenge in Kubernetes.

### 📈 5. High-Availability Autoscaling

HPAs configured for both Nginx and backend deployments with CPU threshold at `70%` and memory at `80%`, with `maxReplicas: 2` hard caps to protect billing limits on `e2-small` nodes.

### 🧱 6. Infrastructure as Code with Terraform (AWS)

The AWS VPC, EKS cluster and IAM roles are defined as Terraform modules with typed variables, per-environment values files and `default_tags` on every resource. State lives in a versioned, encrypted S3 bucket with native locking, created by a separate bootstrap config. The cluster is created and destroyed per session to keep cost near zero.

---

## 🗺️ Roadmap & Future Improvements

- **[In progress] AWS EKS foundations:** finish the Terraform modules, deploy Chatr with Helm on EKS, ALB ingress with HTTPS, and Secrets Manager integration.
- **[Next] CI/CD on AWS:** GitHub Actions with OIDC to AWS (no static keys), Terraform plan on pull requests, images in Amazon ECR, and ArgoCD on EKS.
- **[Next] Observability (separate project):** Prometheus, Alertmanager and Grafana with Slack alerts.
- **Policy enforcement (OPA/Gatekeeper):** enforce rules such as no root containers and mandatory resource limits.
- **Disaster recovery:** automated MongoDB backups, volume snapshots and a tested restore procedure.
- **GitOps rollback testing:** test rollback scenarios when an image push fails in an early pipeline stage.

---

## 📁 Repository structure

```
Chatr/
├── .github/workflows/      # GitHub Actions CI/CD pipeline
├── Helm/                   # Helm chart
│   ├── templates/          # Kubernetes manifest templates
│   ├── values.yaml         # Base values
│   ├── values-dev.yaml     # Dev environment overrides
│   └── values-prod.yaml    # Prod environment overrides
├── terraform/              # AWS infrastructure (VPC, EKS, IAM modules)
├── terraform-bootstrap/    # Creates the S3 bucket for Terraform state
├── argocd/                 # ArgoCD Application manifests
├── client/                 # React + TypeScript frontend
├── server/                 # Node.js + Express + TypeScript backend
├── k8s/                    # Raw Kubernetes manifests (pre-Helm)
├── nginx/                  # Nginx config
├── scripts/                # Utility shell scripts
├── docker-compose.yml      # Local development stack
└── docker-compose.prod.yml # Production Docker Compose
```

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

Actively seeking Cloud / DevOps Engineering roles.

- GitHub: [Pranav-exe](https://github.com/Pranav-exe)
- LinkedIn: [Pranav Sharma](https://www.linkedin.com/in/pranavsharrma)
- Email: sharmapranav2003@gmail.com
