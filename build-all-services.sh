#!/bin/bash
set -e  # Exit script on error

# Prompt for environment tag
echo "Select build environment:"
echo "1) dev"
echo "2) prod"
read -p "Enter choice [1-2]: " choice

case $choice in
  1) TAG="dev" ;;
  2) TAG="prod" ;;
  *) echo "Invalid choice. Exiting."; exit 1 ;;
esac

# List of service directories (names only)
services=(
  api-gateway
  auth-service
  user-service
  product-service
  order-service
  store-service
  content-service
  config-service
  shipping-service
  erp-service
  utility-service
)

# Base image registry
REGISTRY="registry.bloomi5.com"

echo "Starting build for all services with tag: $TAG"

for dir in "${services[@]}"; do
  image_tag="${dir}:${TAG}"
  full_image="${REGISTRY}/${image_tag}"

  if [ -d "$dir" ]; then
    echo "------------------------------------"
    echo "Building image for service: $dir"
    echo "Directory: $(pwd)/$dir"
    echo "Target image: $full_image"
    
    (
      cd "$dir"
      docker build -t "$full_image" .
    )

    echo "Successfully built and tagged: $full_image"
  else
    echo "Directory not found: $dir — skipping."
  fi
done

echo "------------------------------------"
echo "All service builds completed."
