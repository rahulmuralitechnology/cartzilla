#!/bin/bash

# ---- Config ----
IMAGE_TAG="cartzillaecom:latest" 

# ---- Actions ----
echo "Running npm install..."
npm install

echo "Building Docker image using Dockerfile 'npminstall'..."
docker build -f npminstall -t "$IMAGE_TAG" .

echo "Docker image '$IMAGE_TAG' built successfully."
