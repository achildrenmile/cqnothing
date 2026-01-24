#!/bin/sh
set -e

# Generate config.json from environment variables if any are set
CONFIG_FILE="/usr/share/nginx/html/config.json"

if [ -n "$PARENT_SITE_URL" ] || [ -n "$PARENT_SITE_LOGO" ] || [ -n "$PARENT_SITE_NAME" ]; then
    echo "Generating config.json from environment variables..."
    cat > "$CONFIG_FILE" << EOF
{
  "parentSiteUrl": "${PARENT_SITE_URL:-}",
  "parentSiteLogo": "${PARENT_SITE_LOGO:-}",
  "parentSiteName": "${PARENT_SITE_NAME:-}"
}
EOF
    echo "Config generated:"
    cat "$CONFIG_FILE"
else
    echo "No parent site environment variables set, using default config.json"
fi

# Execute the main command (nginx)
exec "$@"
