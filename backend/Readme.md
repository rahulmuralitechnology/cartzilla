# Bloomi5 Backend Microservices

## Service Ports

| Service           | Port |
| ----------------- | ---- |
| API Gateway       | 3000 |
| Auth Service      | 3001 |
| User Service      | 3002 |
| Product Service   | 3003 |
| Order Service     | 3004 |
| Store Service     | 3005 |
| Content Service   | 3006 |
| Config Service    | 3007 |
| Shipping Service  | 3008 |
| ERP Service       | 3009 |
| Utility Service   | 3010 |
| API Documentation | 3011 |

---

## How to run it locally

### Without Docker

- Just the the script called `run-all-svc-without-docker.sh`.

```sh
bash run-all-svc-without-docker.sh
```

### With Docker

```sh
docker-compose -f docker-compose.local.yml up --build
```

- If Latest Docker version is installed.

```sh
docker compose -f docker-compose.local.yml up --build
```
