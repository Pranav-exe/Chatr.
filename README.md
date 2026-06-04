# Chatr 💬 — Production-Grade GitOps & CI/CD Orchestration on GKE

Hello! I'm **Pranav Sharma**, a Cloud & DevOps Engineer. 

**Chatr** is a real-time, three-tier chat application (React, Express, Redis, MongoDB). While the application itself is fully functional and supports real-time messaging, the primary goal of this project was to serve as a comprehensive sandbox to implement and showcase a **production-grade DevOps engineering stack** using **Kubernetes (GKE), GitOps (ArgoCD), and Keyless CI/CD Pipelines (GitHub Actions + WIF)**.

---

## 🏗️ Architecture & Deployment Flow

Here is how the automated infrastructure and application lifecycle flows from code to production:

```
 ┌──────────────┐          ┌─────────────────┐          ┌─────────────┐
 │  Local Code  ├─────────►│  GitHub Actions ├─────────►│ GCP Reg.    │
 │ (push main)  │          │  (Build & Tag)  │          │ (WIF Auth)  │
 └──────────────┘          └────────┬────────┘          └─────────────┘
                                    │
                                    ▼
 ┌──────────────┐          ┌─────────────────┐          ┌─────────────┐
 │  Your App    │◄─────────┤     ArgoCD      │◄─────────┤ Git Tag Env │
 │ (Live GKE!)  │          │   (GitOps Sync) │          │ (yq Update) │
 └──────────────┘          └─────────────────┘          └─────────────┘
```

1. **Local Development:** Developers push changes to the `main` branch.
2. **GitHub Actions CI/CD Pipeline:** 
   * Authenticates securely to Google Cloud Platform (GCP) using **Workload Identity Federation (WIF)**—fully keyless, zero long-lived static JSON credentials stored in GitHub.
   * Compiles the application components using Docker BuildKit (`docker buildx`) for targeted `linux/amd64` architecture, tagging each build with the unique Git commit SHA.
   * Pushes the built container images to the Google Artifact Registry.
3. **Automated GitOps Triggers:** The CI/CD pipeline dynamically updates the image tags in the Helm values files (`values-dev.yaml` and `values-prod.yaml`) using structure-aware parser `yq`, then commits the modifications back to GitHub.
4. **ArgoCD Continuous Deployment:** ArgoCD running in the GKE cluster automatically detects the update in Git, pulls the latest configurations, and syncs the changes to the GKE cluster.
5. **Ingress & Routing:** Nginx Ingress Controller routes traffic dynamically using `nip.io` wildcard DNS resolution to route requests to the application.

---

## 🛠️ Tech Stack & DevOps Toolkit

### Application Stack
* **Frontend:** React, HTML5, Vanilla CSS
* **Backend:** Node.js, Express, WebSocket (Socket.io)
* **Databases:** MongoDB (with persistent volume storage), Redis (Pub/Sub message broker)

### DevOps & Cloud Orchestration
* **Cloud Platform:** Google Cloud Platform (GCP - Compute Engine, GKE, Artifact Registry)
* **Orchestration:** Google Kubernetes Engine (GKE)
* **Package Management:** Helm v3
* **Continuous Integration:** GitHub Actions
* **Continuous Delivery / GitOps:** ArgoCD
* **Security & Auth:** Google Workload Identity Federation (OIDC / STS), Kubernetes Secrets
* **Ingress & Networking:** Nginx Ingress Controller, Wildcard DNS (`nip.io`)
* **Autoscaling:** Horizontal Pod Autoscaler (HPA)

---

## 🔒 DevOps Engineering Showcases

### 🔑 1. Keyless Authentication via WIF (Workload Identity Federation)
Instead of storing sensitive, long-lived GCP service account keys inside GitHub Secrets (which is a major security risk), this project implements WIF. GitHub Actions presents a short-lived OIDC token to Google's Security Token Service (STS) which is verified and exchanged for a 1-hour GCP credential. This guarantees **zero risk of leaked private key files**.

### 🔄 2. Dynamic GitOps Tagging with `yq`
In a GitOps world, the Git repository is the single source of truth. We avoid using mutable tags like `:latest` because Kubernetes caches them, causing update failures and untraceable builds. Instead, the pipeline parses and modifies the nested Helm structures using structure-aware parser `yq` to insert the unique Git commit SHA tag on every build, ensuring clean versioning and audit trails.

### 🛡️ 3. Safe Secret Management
To prevent leaks in public repositories, all production secrets (JWT keys, Database administrative passwords) have been completely externalized. 
* Helm templates are configured with a conditional check (`{{- if not .Values.secrets.existingSecretName }}`) to prevent the generation of plain-text secret templates inside Git.
* Production databases and services consume secrets that are pre-provisioned manually on the cluster itself under the `chatr` namespace.

### 📈 4. High-Availability Autoscaling
To optimize infrastructure costs while protecting GKE from traffic spikes, HPAs are configured for both Nginx and backend deployments:
* Hard caps are enforced at `maxReplicas: 2` (protecting GKE billing limits on standard `e2-small` nodes).
* Target thresholds are set at `70% CPU` and `80% Memory` utilization to scale up/down dynamically.

---

## 🚀 How to Run locally

To spin up the entire application stack locally using Docker Compose:
```bash
docker-compose up --build
```
This launches React, Express, MongoDB, and Redis in isolated network containers.

---

## 👨‍💻 Connect with Me
I am actively seeking opportunities in **Cloud / DevOps Engineering** roles.

* **GitHub:** [Pranav-exe](https://github.com/Pranav-exe)
* **LinkedIn:** [Pranav Sharma](https://www.linkedin.com)
* **Email:** [Your Email Address]
* **Portfolio Hashnode Blog:** [Link to your Blog]
