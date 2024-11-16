up:
	@docker compose up

build:
	@docker compose build

build-up:
	@docker compose up --build

down:
	@docker compose down --remove-orphans

fullstart:
	@cp .env.example .env
	@docker compose build
	@docker compose up -d
	@docker compose run --rm backend python manage.py preload_app
	@cat README.md
	@docker attach pharmaplug/pharmaplug_mobile

backend-command:
	@docker compose run --rm backend ${command}

web-command:
	@docker compose run --rm web ${command}
