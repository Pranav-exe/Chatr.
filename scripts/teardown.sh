#!/bin/bash
# ──────────────────────────────────────────────────────────────────
# Chatr — Full Teardown (Delete Cluster)
# ──────────────────────────────────────────────────────────────────
# Use when you're DONE for the day. Deletes the entire cluster.
# All data (MongoDB) will be LOST.
# To recreate: ./k8s/setup-cluster.sh then ./k8s/deploy.sh
# ──────────────────────────────────────────────────────────────────

CLUSTER_NAME="chatr-cluster"
REGION="asia-south1"
PROJECT_ID=$(gcloud config get-value project)

echo "🗑️  Tearing down Chatr cluster..."
echo "   Cluster: $CLUSTER_NAME"
echo "   Region:  $REGION"
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
  --region=$REGION \
  --project=$PROJECT_ID \
  --quiet

echo ""
echo "✅ Cluster deleted. $0 cost from now."
echo ""
echo "To recreate: ./k8s/setup-cluster.sh"
echo "Then deploy: ./k8s/deploy.sh"
