#!/bin/bash
# ──────────────────────────────────────────────────────────────────
# Chatr — Trivy Security Scan Script
# ──────────────────────────────────────────────────────────────────
# WHAT IS TRIVY?
#   Trivy is a FREE, open-source vulnerability scanner by Aqua Security.
#   It scans your Docker images for known CVEs (Common Vulnerabilities
#   and Exposures) — i.e., security holes in OS packages and app deps.
#
# WHAT DOES THIS SCRIPT DO?
#   1. Checks if Trivy is installed (and tells you how to install it)
#   2. Scans each Chatr Docker image for HIGH and CRITICAL vulnerabilities
#   3. Generates a summary report
#   4. Exits with code 1 if CRITICAL issues found (blocks CI/CD pipelines)
#
# USAGE:
#   ./scripts/trivy-scan.sh                    # scan all images
#   ./scripts/trivy-scan.sh --severity CRITICAL # only critical issues
#   TRIVY_EXIT_CODE=0 ./scripts/trivy-scan.sh  # don't fail on findings
# ──────────────────────────────────────────────────────────────────

set -e

# ── CONFIGURATION ──────────────────────────────────────────────────
# Your GKE Artifact Registry prefix (match your values-prod.yaml)
REGISTRY="asia-south1-docker.pkg.dev/YOUR_PROJECT_ID/chatr"

# Images to scan (local tag → what you built with docker build)
IMAGES=(
  "chatr-backend:v2"
  "chatr-nginx:v2"
)

# Severity levels to check: UNKNOWN,LOW,MEDIUM,HIGH,CRITICAL
SEVERITY="${SEVERITY:-HIGH,CRITICAL}"

# Exit with error code 1 if vulnerabilities found? (set to 0 to just warn)
# In CI/CD pipelines, keep this at 1 to block bad deployments
EXIT_CODE="${TRIVY_EXIT_CODE:-1}"

# ── COLORS ─────────────────────────────────────────────────────────
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m' # No Color

# ── FUNCTIONS ──────────────────────────────────────────────────────

print_header() {
  echo ""
  echo -e "${CYAN}╔══════════════════════════════════════════════════════════╗${NC}"
  echo -e "${CYAN}║         🔍 Chatr — Trivy Security Scanner               ║${NC}"
  echo -e "${CYAN}╚══════════════════════════════════════════════════════════╝${NC}"
  echo ""
}

check_trivy_installed() {
  if ! command -v trivy &> /dev/null; then
    echo -e "${RED}❌ Trivy is not installed!${NC}"
    echo ""
    echo -e "${YELLOW}📦 Install Trivy (FREE — pick one):${NC}"
    echo ""
    echo -e "  ${BOLD}macOS (Homebrew):${NC}"
    echo "    brew install trivy"
    echo ""
    echo -e "  ${BOLD}Linux (Script):${NC}"
    echo "    curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin"
    echo ""
    echo -e "  ${BOLD}Docker (no install needed):${NC}"
    echo "    docker run --rm -v /var/run/docker.sock:/var/run/docker.sock \\"
    echo "      aquasec/trivy image chatr-backend:v2"
    echo ""
    exit 1
  fi
  echo -e "${GREEN}✅ Trivy $(trivy --version | head -1) found${NC}"
}

scan_image() {
  local image=$1
  local scan_num=$2
  local total=$3

  echo ""
  echo -e "${BLUE}────────────────────────────────────────────────────────────${NC}"
  echo -e "${BOLD}[${scan_num}/${total}] Scanning: ${YELLOW}${image}${NC}"
  echo -e "${BLUE}────────────────────────────────────────────────────────────${NC}"

  # WHY THESE FLAGS?
  # --exit-code 1      → return error code if vulns found (for CI/CD)
  # --severity         → only show HIGH and CRITICAL (ignore LOW/MEDIUM noise)
  # --no-progress      → cleaner output in CI pipelines
  # --format table     → human-readable table output
  # --ignore-unfixed   → skip vulns with no fix yet (reduces noise)
  trivy image \
    --exit-code "${EXIT_CODE}" \
    --severity "${SEVERITY}" \
    --no-progress \
    --format table \
    --ignore-unfixed \
    "${image}" 2>&1

  local exit_status=$?

  if [ $exit_status -eq 0 ]; then
    echo -e "${GREEN}✅ ${image} — No ${SEVERITY} vulnerabilities found!${NC}"
  else
    echo -e "${RED}⚠️  ${image} — Vulnerabilities detected! See above.${NC}"
    FAILED_IMAGES+=("${image}")
  fi

  return $exit_status
}

print_summary() {
  echo ""
  echo -e "${CYAN}╔══════════════════════════════════════════════════════════╗${NC}"
  echo -e "${CYAN}║                    📊 SCAN SUMMARY                      ║${NC}"
  echo -e "${CYAN}╚══════════════════════════════════════════════════════════╝${NC}"
  echo ""

  if [ ${#FAILED_IMAGES[@]} -eq 0 ]; then
    echo -e "${GREEN}🎉 All images passed security scan!${NC}"
    echo -e "   No ${SEVERITY} vulnerabilities found."
  else
    echo -e "${RED}❌ The following images have ${SEVERITY} vulnerabilities:${NC}"
    for img in "${FAILED_IMAGES[@]}"; do
      echo -e "   ${RED}• ${img}${NC}"
    done
    echo ""
    echo -e "${YELLOW}💡 HOW TO FIX:${NC}"
    echo "   1. Update your base image tag (e.g. node:18-alpine → node:20-alpine)"
    echo "   2. Run: trivy image --format json <image> > report.json (for details)"
    echo "   3. Update vulnerable packages in your Dockerfile"
    echo "   4. Rebuild: docker build -t <image> ."
    echo "   5. Re-run this script to verify fixes"
  fi
  echo ""
}

# ── MAIN ───────────────────────────────────────────────────────────

FAILED_IMAGES=()
OVERALL_EXIT=0

print_header
check_trivy_installed

echo ""
echo -e "🎯 Scanning severity: ${YELLOW}${SEVERITY}${NC}"
echo -e "📋 Images to scan:    ${YELLOW}${#IMAGES[@]}${NC}"
echo -e "🚫 Fail on findings:  ${YELLOW}$([ "$EXIT_CODE" = "1" ] && echo "YES (CI mode)" || echo "NO (audit mode)")${NC}"

# Scan each image
TOTAL=${#IMAGES[@]}
for i in "${!IMAGES[@]}"; do
  scan_image "${IMAGES[$i]}" "$((i+1))" "$TOTAL" || OVERALL_EXIT=1
done

print_summary

# Also scan Helm chart for misconfigurations (BONUS — free!)
echo -e "${BLUE}────────────────────────────────────────────────────────────${NC}"
echo -e "${BOLD}🔧 Scanning Helm chart for misconfigurations...${NC}"
echo -e "${BLUE}────────────────────────────────────────────────────────────${NC}"
echo ""
# WHY THIS?
# Trivy can also scan your Kubernetes YAML/Helm charts for bad configs:
# - Containers running as root
# - Missing resource limits
# - Missing security contexts
# - Privileged containers
trivy config \
  --severity HIGH,CRITICAL \
  --no-progress \
  ./Helm/ 2>&1 || true   # || true → don't fail the script for config issues (just warn)

echo ""
echo -e "${CYAN}────────────────────────────────────────────────────────────${NC}"
echo -e "✅ Scan complete. Exit code: ${OVERALL_EXIT}"
echo ""

# 💡 LEARNING NOTE:
# In GitHub Actions CI/CD (Phase 2), this script will run automatically
# on every push. If it exits with code 1, the pipeline stops and
# the bad image NEVER gets deployed to GKE. That's DevSecOps!

exit $OVERALL_EXIT
