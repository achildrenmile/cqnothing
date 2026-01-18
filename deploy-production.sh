#!/bin/bash

# Deploy CQ… Nothing. to Synology NAS
# Usage: ./deploy-production.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Load environment variables
if [ -f "$SCRIPT_DIR/.env.production" ]; then
  export $(grep -v '^#' "$SCRIPT_DIR/.env.production" | xargs)
else
  echo "ERROR: .env.production not found"
  echo "Copy .env.production.example to .env.production and configure it"
  exit 1
fi

echo ""
echo "=========================================="
echo "Deploying CQ… Nothing."
echo "=========================================="

# Pull latest changes
echo "[1/4] Pulling latest changes..."
ssh $SYNOLOGY_HOST "cd $REMOTE_DIR && git pull"

# Build Docker image
echo "[2/4] Building Docker image..."
ssh $SYNOLOGY_HOST "/usr/local/bin/docker build -t ${CONTAINER_NAME}:latest $REMOTE_DIR"

# Restart container
echo "[3/4] Restarting container..."
ssh $SYNOLOGY_HOST "/usr/local/bin/docker stop $CONTAINER_NAME 2>/dev/null || true"
ssh $SYNOLOGY_HOST "/usr/local/bin/docker rm $CONTAINER_NAME 2>/dev/null || true"

ssh $SYNOLOGY_HOST "/usr/local/bin/docker run -d \
  --name $CONTAINER_NAME \
  --restart unless-stopped \
  -p $PORT:80 \
  ${CONTAINER_NAME}:latest"

# Verify
echo "[4/4] Verifying deployment..."
sleep 3
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$SITE_URL")

if [ "$HTTP_CODE" = "200" ]; then
  echo "✅ CQ… Nothing. deployed successfully ($SITE_URL - HTTP $HTTP_CODE)"
else
  echo "⚠️  CQ… Nothing. returned HTTP $HTTP_CODE"
fi

echo ""
echo "=========================================="
echo "Deployment complete!"
echo "=========================================="
