#!/bin/bash
git pull origin main
docker compose up -d --build --remove-orphans
docker image prune -f
