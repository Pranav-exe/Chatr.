#!/bin/bash
# ──────────────────────────────────────────────────────────────────
# Chatr — GKE Cluster Setup Script
# Run this ONCE before deploy.sh
# ──────────────────────────────────────────────────────────────────
set -e

PROJECT_ID=$(gcloud config get-value project)
CLUSTER_NAME="chatr-cluster"
ZONE="asia-south1-a"
REGION="asia-south1"

echo "🔧 Setting up Chatr GKE environment..."
echo "   Project: $PROJECT_ID"
echo "   Cluster: $CLUSTER_NAME"
echo "   Zone:    $ZONE"
echo "────────────────────────────"

# Step 1 — Authenticate Docker with Artifact Registry
echo "🔐 Configuring Docker for Artifact Registry..."
gcloud auth configure-docker $REGION-docker.pkg.dev --quiet

# Step 2 — Create GKE cluster
echo "☁️  Creating GKE cluster (this takes 3-5 minutes)..."
gcloud container clusters create $CLUSTER_NAME \
  --zone $ZONE \
  --num-nodes 1 \
  --machine-type e2-medium \
  --disk-size 20 \
  --no-enable-autoupgrade \
  --no-enable-autorepair \
  --project $PROJECT_ID

# Step 3 — Get credentials and point kubectl at GKE
echo "🔗 Configuring kubectl..."
gcloud container clusters get-credentials $CLUSTER_NAME \
  --zone $ZONE \
  --project $PROJECT_ID

# Step 4 — Verify kubectl context
echo "✅ kubectl context set to:"
kubectl config current-context

echo ""
echo "────────────────────────────"
echo "✅ Cluster ready!"
echo ""
echo "Next step — create your secrets then run:"
echo "   ./scripts/deploy.sh"