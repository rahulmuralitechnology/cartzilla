#!/bin/bash

curl -X POST \
  -H "Content-Type: application/json" \
  -d '{
        "push_data": {
          "tag": "latest"
        },
        "repository": {
          "repo_name": "cms1main.azurecr.io/cms"
        }
      }' \
  "https://$main-cmss:23lfatJXfvZTcyRkE5l9rvYgtiqApSJtfnPznR1WzRiALsejy4eR12aBP9zH@main-cmss.scm.azurewebsites.net/api/registry/webhook"

echo "Webhook sent to cms-main  main-cmss.azurewebsites.net"