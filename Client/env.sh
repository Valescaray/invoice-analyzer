#!/bin/sh
# This script generates a config.js file from environment variables
# It is intended to be run at container startup

echo "window.env = {" > /usr/share/nginx/html/env-config.js

# List specific variables to exposing
for var in VITE_API_BASE_URL \
           VITE_FIREBASE_API_KEY \
           VITE_FIREBASE_AUTH_DOMAIN \
           VITE_FIREBASE_PROJECT_ID \
           VITE_FIREBASE_STORAGE_BUCKET \
           VITE_FIREBASE_MESSAGING_SENDER_ID \
           VITE_FIREBASE_APP_ID; do
  value=$(printenv "$var")
  if [ -n "$value" ]; then
    echo "  $var: \"$value\"," >> /usr/share/nginx/html/env-config.js
  fi
done

echo "};" >> /usr/share/nginx/html/env-config.js
