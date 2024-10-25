images=$(shell docker image ls -aq)

all: build

build:
	docker-compose -f docker-compose.yml build

up: build
	docker-compose -f docker-compose.yml up

down:
	docker-compose -f docker-compose.yml down

ELK:
	docker-compose -f ./ELK/docker-compose.yml up

ELK_down:
	docker-compose -f ./ELK/docker-compose.yml down

delete_images:
	if [ -n "$(images)" ];\
		then docker rmi $(images);\
	else\
		echo "No images to delete";\
	fi

fclean: down ELK_down delete_images
	docker system prune -a --force

.PHONY: all build up down delete_images fclean ELK

.SILENT: all build up down delete_images fclean
