.PHONY: install setup-env dev test build start setup-db migrate seed clean lint format check-ports kill-ports ngrok

# Installation
install:
	pnpm install
	cd frontend && pnpm install
	cd backend && pnpm install

# Environment Setup
setup-env:
	cp .env.example .env
	cp frontend/.env.example frontend/.env.local
	cp backend/.env.example backend/.env

# Development
dev:
	cd backend && pnpm dev & cd frontend && pnpm dev

# Testing
test: test-frontend test-backend test-e2e

test-frontend:
	cd frontend && pnpm test

test-backend:
	cd backend && pnpm test

test-e2e:
	cd frontend && pnpm test:e2e

coverage:
	cd frontend && pnpm test:coverage
	cd backend && pnpm test:coverage

# Building
build:
	cd frontend && pnpm build
	cd backend && pnpm build

# Production
start:
	cd backend && pnpm start & cd frontend && pnpm start

# Database
setup-db:
	mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS lms_payments;"

migrate:
	cd backend && pnpm migrate

seed:
	cd backend && pnpm seed

# Utilities
clean:
	rm -rf node_modules
	rm -rf frontend/node_modules
	rm -rf backend/node_modules
	rm -rf frontend/.next
	rm -rf frontend/build
	rm -rf backend/dist

lint:
	cd frontend && pnpm lint
	cd backend && pnpm lint

format:
	cd frontend && pnpm format
	cd backend && pnpm format

check-ports:
	lsof -i :3001
	lsof -i :3003

kill-ports:
	kill -9 $$(lsof -t -i:3001) 2>/dev/null || true
	kill -9 $$(lsof -t -i:3003) 2>/dev/null || true

ngrok:
	ngrok http 3001

# Help
help:
	@echo "Available commands:"
	@echo "  make install      - Install all dependencies"
	@echo "  make setup-env    - Set up environment files"
	@echo "  make dev         - Start development servers"
	@echo "  make test        - Run all tests"
	@echo "  make build       - Build for production"
	@echo "  make start       - Start production servers"
	@echo "  make setup-db    - Create database"
	@echo "  make migrate     - Run database migrations"
	@echo "  make seed        - Seed database with sample data"
	@echo "  make clean       - Clean all build files"
	@echo "  make lint        - Run linting"
	@echo "  make format      - Format code"
	@echo "  make check-ports - Check if ports are in use"
	@echo "  make kill-ports  - Kill processes on ports"
	@echo "  make ngrok       - Start ngrok tunnel" 