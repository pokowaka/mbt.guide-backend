#!/bin/sh
git secret reveal
base64 -i config/firebase-admin.json | gh secret set GCE_CONFIG_FIREBASE_ADMIN_JSON
base64 -i .env.yaml | gh secret set GCE_CONFIG_ENV_YAML
