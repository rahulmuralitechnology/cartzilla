#!/usr/bin/env bash
set -e

for service_dir in */; do
  if [ -f "${service_dir}package.json" ]; then
    echo "Starting ${service_dir%/}..."
    (
      cd "$service_dir"
      npm install
      npm run dev
    ) &
  fi

done

wait
