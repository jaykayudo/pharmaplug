up:
	@docker compose up

build:
	@docker compose build

build-up:
	@docker compose up --build

down:
	@docker compose down --remove-orphans

fullstart:
	@docker compose up --build
	@docker compose run --rm pharmaplug_backend python manage.py preload_app