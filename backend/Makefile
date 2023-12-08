up:
	docker compose -f docker-compose-local.yaml up -d
down:
	docker compose -f docker-compose-local.yaml down && docker network prune --force
revision:
	alembic revision --autogenerate -m "$(C)"
upgrade:
	alembic upgrade heads