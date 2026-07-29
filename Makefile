# TaskFlow — convenience commands.
# Run `make help` to see this list.

.DEFAULT_GOAL := help

# ---------------------------------------------------------------------------
# Docker (primary workflow)
# ---------------------------------------------------------------------------

.PHONY: up
up: ## Start all services in the foreground (Ctrl+C to stop)
	docker-compose up --build

.PHONY: upd
upd: ## Start all services in the background
	docker-compose up --build -d

.PHONY: down
down: ## Stop and remove containers (keeps the Mongo data volume)
	docker-compose down

.PHONY: down-v
down-v: ## Stop and remove containers AND wipe the Mongo data volume
	docker-compose down -v

.PHONY: restart
restart: ## Restart all services
	docker-compose restart

.PHONY: logs
logs: ## Tail logs from all services
	docker-compose logs -f

.PHONY: logs-server
logs-server: ## Tail logs from the server only
	docker-compose logs -f server

.PHONY: logs-client
logs-client: ## Tail logs from the client only
	docker-compose logs -f client

.PHONY: ps
ps: ## Show running service status
	docker-compose ps

.PHONY: sh-server
sh-server: ## Open a shell inside the running server container
	docker exec -it tm_server sh

.PHONY: sh-client
sh-client: ## Open a shell inside the running client container
	docker exec -it tm_client sh

.PHONY: sh-mongo
sh-mongo: ## Open a mongosh shell inside the running Mongo container
	docker exec -it tm_mongodb mongosh -u admin -p adminpassword123 --authenticationDatabase admin

# ---------------------------------------------------------------------------
# Environment setup
# ---------------------------------------------------------------------------

.PHONY: env
env: ## Create server/.env and client/.env from their .env.example templates (won't overwrite existing files)
	@test -f server/.env || cp server/.env.example server/.env
	@test -f client/.env || cp client/.env.example client/.env
	@echo "server/.env and client/.env are ready. Set JWT_SECRET in server/.env before first run."

.PHONY: secret
secret: ## Generate a random JWT secret you can paste into server/.env
	@node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# ---------------------------------------------------------------------------
# Database
# ---------------------------------------------------------------------------

.PHONY: seed
seed: ## Re-run the seeder inside the running server container
	docker exec -it tm_server npm run seed

.PHONY: seed-fresh
seed-fresh: ## Wipe and re-seed the database inside the running server container
	docker exec -it tm_server npm run seed:fresh

# ---------------------------------------------------------------------------
# Local (non-Docker) development
# ---------------------------------------------------------------------------

.PHONY: install
install: ## Install dependencies for both server and client
	cd server && npm install
	cd client && npm install

.PHONY: dev-server
dev-server: ## Run the server locally with nodemon (requires local/remote MongoDB)
	cd server && npm run dev

.PHONY: dev-client
dev-client: ## Run the client locally with Vite
	cd client && npm run dev

# ---------------------------------------------------------------------------
# Testing
# ---------------------------------------------------------------------------

.PHONY: test
test: test-server test-client ## Run both server and client test suites

.PHONY: test-server
test-server: ## Run server tests (Jest)
	cd server && npm test

.PHONY: test-client
test-client: ## Run client tests (Vitest)
	cd client && npm test

# ---------------------------------------------------------------------------
# Cleanup
# ---------------------------------------------------------------------------

.PHONY: clean
clean: ## Remove containers, volumes, and local node_modules for a full reset
	docker-compose down -v
	rm -rf server/node_modules client/node_modules

.PHONY: help
help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'
