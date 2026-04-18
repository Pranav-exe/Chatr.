#!/bin/bash
# ──────────────────────────────────────────────────────────────────
# Chatr — Pause All Pods (Scale to 0)
# ──────────────────────────────────────────────────────────────────
# Use this for SHORT breaks. Cluster stays running but pods stop.
# Data is preserved. Resume with: ./k8s/resume.sh
# Cost: Cluster fee only (~$0.10/hour), no pod costs.
# ──────────────────────────────────────────────────────────────────

echo "⏸️  Pausing Chatr (scaling to 0)..."
kubectl -n chatr scale deployment backend nginx redis --replicas=0
kubectl -n chatr scale statefulset mongodb --replicas=0

echo ""
echo "✅ All pods stopped. Data is preserved."
echo "💰 You're only paying for the cluster management fee now."
echo ""
echo "To resume:  ./k8s/resume.sh"
echo "To delete:  ./k8s/teardown.sh"
