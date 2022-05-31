.PHONY=dev db

dev:
	docker-compose -f ./docker-compose.dev.yaml up -d

db:
	docker-compose -f ./docker-compose.db.yaml up