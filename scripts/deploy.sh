#!/bin/bash
# ──────────────────────────────────────────────────────────────────
# Chatr — GKE Deployment Script (No Load Balancer — Cost Optimized)
# ──────────────────────────────────────────────────────────────────
set -e

echo "🚀 Deploying Chatr to GKE..."
echo "────────────────────────────"

echo "📦 Creating namespace..."
kubectl apply -f k8s/namespace.yml

echo "🔐 Creating secrets..."
kubectl apply -f k8s/mongodb/secret.yml
kubectl apply -f k8s/backend/secret.yml

echo "⚙️  Creating config..."
kubectl apply -f k8s/backend/configmap.yml

# Step 4: MongoDB (database must be ready before backend)
echo "🍃 Deploying MongoDB..."
kubectl apply -f k8s/mongodb/statefulset.yml
kubectl apply -f k8s/mongodb/service.yml
echo "   Waiting for MongoDB to be ready..."
kubectl -n chatr rollout status statefulset/mongodb --timeout=120s

echo "⚡ Deploying Redis..."
kubectl apply -f k8s/redis/deployment.yml
kubectl apply -f k8s/redis/service.yml
kubectl -n chatr rollout status deployment/redis --timeout=60s

echo "🖥️  Deploying Backend..."
kubectl apply -f k8s/backend/deployment.yml
kubectl apply -f k8s/backend/service.yml
kubectl -n chatr rollout status deployment/backend --timeout=120s

echo "🌐 Deploying Nginx..."
kubectl apply -f k8s/nginx/deployment.yml
kubectl apply -f k8s/nginx/service.yml
kubectl -n chatr rollout status deployment/nginx --timeout=60s

echo ""
echo "────────────────────────────"
echo "✅ Deployment complete!"
echo ""
kubectl -n chatr get pods
echo ""
kubectl -n chatr get svc
echo ""
echo "⏳ Waiting for external IP to be assigned..."
echo "   (Ctrl+C once you see the IP)"
echo ""
kubectl -n chatr get svc nginx --watch