# Node.js + Redis — Docker Multi-Container Lab

A hands-on Docker project demonstrating containerization, networking, persistent storage, health checks, restart policies, and multi-container orchestration with Docker Compose.

## Overview

This project contains a Node.js web application built with Express and Redis. The application tracks page visits using Redis as its backend data store.

The project progresses from manually managed Docker containers to a Docker Compose deployment with persistent Redis storage and automated health checks.

## Architecture

- **Node.js + Express:** Web application running on container port `3000`.
- **Redis 7:** Stores the page visit counter on port `6379`.
- **Docker network:** Enables communication between application and database containers.
- **Named volume:** Persists Redis data independently of the Redis container lifecycle.
- **Health checks:** Monitor the availability of the application and Redis.
- **Docker Compose:** Defines and manages the multi-container application stack.

## Technologies

- Docker and Docker Compose
- Node.js and Express
- Redis
- YAML
- Git and GitHub

## Prerequisites

- Docker Desktop or Docker Engine
- Docker Compose
- Git

## Stage 1 — Run Containers Manually

Build the Docker image:

```bash
docker build -t node-redis-app .
```

Create a network:

```bash
docker network create app-net
```

Start Redis:

```bash
docker run -d \
  --name redis-db \
  --network app-net \
  redis:7
```

Start the Node.js application:

```bash
docker run -d \
  --name node-app \
  --network app-net \
  -p 3000:3000 \
  node-redis-app
```

Open the application:

- Dashboard: http://localhost:3000
- Health endpoint: http://localhost:3000/health

Refresh the dashboard to increment the visit counter.

## Stage 2 — Persistent Redis Storage

Redis data stored only in container memory can be lost when the container is removed.

To demonstrate persistent storage, create a named volume and start Redis with append-only file persistence enabled.

```bash
docker volume create redis-data
```

```bash
docker run -d \
  --name redis-db-2 \
  --network app-net-2 \
  --mount source=redis-data,target=/data \
  --restart unless-stopped \
  redis:7 \
  redis-server --appendonly yes
```

The volume is mounted at `/data`, where Redis stores its persistence files.

Verify Redis:

```bash
docker exec redis-db-2 redis-cli ping
```

Expected output:

```text
PONG
```

Inspect the volume:

```bash
docker volume inspect redis-data
```

## Stage 3 — Docker Compose

```

Check Redis connectivity:

```bash
docker compose -p node-redis-compose exec redis redis-cli ping
```

Open the application:

- Dashboard: http://localhost:3002
- Health endpoint: http://localhost:3002/health

### Compose Configuration Features

- **Service orchestration:** Runs Node.js and Redis together.
- **Service discovery:** The application connects to Redis using `redis://redis:6379`.
- **Persistent storage:** A named volume, `redis-compose-data`, stores Redis data.
- **Health checks:** Redis health is checked with `redis-cli ping`; the application has an HTTP health check.
- **Startup ordering:** The application waits until Redis is healthy before starting.
- **Restart policies:** Both services use `unless-stopped`.
- **Port mapping:** Host port `3002` maps to application port `3000` inside the container.

### Verify Persistent Data

Read the visit counter:

```bash
docker compose -p node-redis-compose exec redis redis-cli GET visits
```

Stop and remove the Compose containers without deleting the named volume:

```bash
docker compose -p node-redis-compose down
```

Start the stack again:

```bash
docker compose -p node-redis-compose up -d
```

Read the counter again:

```bash
docker compose -p node-redis-compose exec redis redis-cli GET visits
```

The counter should retain its previous value, provided the named volume is preserved and Redis has completed its persistence writes.

**Important:** Do not add `-v` to the `down` command when testing persistence. That option removes the Compose-managed named volume.

## Health Check Example

The application health endpoint returns JSON describing the application and Redis connection.

Example response:

```json
{
  "status": "healthy",
  "application": "Node.js + Express",
  "redis": "connected"
}
```

## Screenshots

The `Screenshots/` directory contains evidence from the lab, including:

Docker Compose manages the application and Redis services using the `compose.yaml` file.

Start the stack:

```bash
docker compose -p node-redis-compose up -d --build

```bash
docker compose -p node-redis-compose ps
```

View application logs:

```bash
docker compose -p node-redis-compose logs --tail=20 app
- Docker network creation
- Redis connectivity and `PONG` response
- Visit counter after rebuilding

- Application health endpoint
- Running containers and dashboard


## Skills Demonstrated


- Writing and building Docker images
- Running and managing containers
- Docker bridge networking and service discovery
- Redis persistence with named volumes
- Docker health checks and restart policies
- Multi-container orchestration with Docker Compose
- Troubleshooting container startup and connectivity
- Git version control and technical documentation

## Project Goal

This lab demonstrates practical containerization and infrastructure skills relevant to junior DevOps, Linux administration, cloud support, and IT infrastructure roles.

## Author

Ahmed Imed Eddine

GitHub: [ahmedimed](https://github.com/ahmedimed)

