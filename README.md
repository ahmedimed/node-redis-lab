# Node.js and Redis — Docker Multi-Container Lab

## Overview

A simple Node.js web application that counts page visits using Redis as a backend service. Both services run in separate Docker containers connected through a custom Docker bridge network.

## Architecture

* **Node.js + Express:** Web application exposed on port `3000`.
* **Redis 7:** Stores the visit counter on internal port `6379`.
* **Docker network:** `app-net` enables communication between the containers.
* **Docker image:** `node-redis-app`.

## Prerequisites

* Docker Desktop or Docker Engine
* Git

## Run the Application

Build the image:

```bash
docker build -t node-redis-app .
```

Create the network:

```bash
docker network create app-net
```

Start Redis:

```bash
docker run -d --name redis-db --network app-net redis:7
```

Start Node.js:

```bash
docker run -d --name node-app --network app-net -p 3000:3000 node-redis-app
```

Open `http://localhost:3000` and refresh the page to increment the visit counter.

## Verification

```bash
docker ps
docker logs redis-db
docker logs node-app
docker network inspect app-net
docker exec redis-db redis-cli ping

Expected Redis response: PONG.

```

## Container Lifecycle Test

Stopped both containers with `docker stop`, restarted them with `docker start`, and verified that the visit counter continued from its previous value.

Redis stores this counter in memory in this exercise. Removing and recreating the Redis container loses the counter because persistent storage is not configured.

## Skills Demonstrated

Docker images and containers, Dockerfiles, Node.js, Express, Redis, container networking, port mapping, logs, and container lifecycle management.
