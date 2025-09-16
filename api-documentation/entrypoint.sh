#!/bin/sh

# Wait until the database is reachable
until npx prisma db push; do
  echo "Waiting for the database to be ready..."
  sleep 2
done

# Start the application
npm start
