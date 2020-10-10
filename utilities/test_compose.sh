#!/bin/bash

# This script provides an easy way to run docker-compose test commands 

source .env-util
export COMPOSE_PROJECT_NAME=mbt_guide_backend_util

# Example command
# docker-compose -f docker-compose.util.yml up seed

# docker-compose -f docker-compose.util.yml run mongo mongod --repair
# docker-compose -f docker-compose.util.yml run mongo rm /data/db/mongod.lock
# docker-compose -f docker-compose.util.yml up mongo
# docker-compose -f docker-compose.util.yml rm -v mongo

# Uncomment the line below to sh into the container (useful for debugging).
# docker-compose -f docker-compose.util.yml exec mongo sh


docker-compose -f docker-compose.util.yml up -d mongo
# docker-compose -f docker-compose.util.yml up -d api