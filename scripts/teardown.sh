#!/bin/bash
# ──────────────────────────────────────────────────────────────────
# Chatr — Full Teardown (Delete Cluster)
# ──────────────────────────────────────────────────────────────────
# Use when you're DONE for the day. Deletes the entire cluster.
# All data (MongoDB) will be LOST.
# To recreate: ./scripts/setup.sh then ./scripts/deploy.sh
# ──────────────────────────────────────────────────────────────────
set -e

CLUSTER_NAME="chatr-cluster"
ZONE="asia-south1-a"
PROJECT_ID=$(gcloud config get-value project)

echo "🗑️  Tearing down Chatr cluster..."
echo "   Cluster: $CLUSTER_NAME"
echo "   Zone:    $ZONE"
echo "   Project: $PROJECT_ID"
echo ""
echo "⚠️  WARNING: This will delete the cluster and ALL data!"
read -p "   Continue? (y/N): " confirm

if [[ "$confirm" != "y" && "$confirm" != "Y" ]]; then
  echo "❌ Cancelled."
  exit 0
fi

echo ""
echo "Deleting cluster (this takes 2-5 minutes)..."
gcloud container clusters delete $CLUSTER_NAME \
  --zone=$ZONE \
  --project=$PROJECT_ID \
  --quiet

echo ""
echo "✅ Cluster deleted. Zero cost from now."
echo ""
echo "To recreate: ./scripts/setup.sh"
echo "Then deploy: ./scripts/deploy.sh"