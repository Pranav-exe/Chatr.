#!/bin/bash
# ──────────────────────────────────────────────────────────────────
# Chatr — Resume All Pods (Scale back up)
# ──────────────────────────────────────────────────────────────────
# Use after ./k8s/pause.sh to bring everything back up.
# MongoDB must come up first, then Redis, then Backend, then Nginx.
# ──────────────────────────────────────────────────────────────────
set -e

echo "▶️  Resuming Chatr..."

echo "🍃 Starting MongoDB..."
kubectl -n chatr scale statefulset mongodb --replicas=1
kubectl -n chatr rollout status statefulset/mongodb --timeout=120s

echo "⚡ Starting Redis..."
kubectl -n chatr scale deployment redis --replicas=1
kubectl -n chatr rollout status deployment/redis --timeout=60s

echo "🖥️  Starting Backend..."
kubectl -n chatr scale deployment backend --replicas=1
kubectl -n chatr rollout status deployment/backend --timeout=120s

echo "🌐 Starting Nginx..."
kubectl -n chatr scale deployment nginx --replicas=1
kubectl -n chatr rollout status deployment/nginx --timeout=60s

echo ""
echo "✅ All pods running!"
kubectl -n chatr get pods
