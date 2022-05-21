#!/bin/bash
# Script that runs the prod docker image for local testing. This script is NOT used in production.

# docker build --no-cache -t mbt_guide/backend -f ./Dockerfile.prod
docker build -t mbt_guide/backend -f ./Dockerfile.prod .

docker run --rm \
-p 80:8080 \
--env-file .env \
--name mbt_guide_backend \
-i mbt_guide/backend
