images=$(shell docker image ls -aq)

all: build

build:
	docker-compose -f docker-compose.yml build

up: 
	docker-compose -f docker-compose.yml up

down:
	docker-compose -f docker-compose.yml down -v

delete_images:
	if [ -n "$(images)" ];\
		then docker rmi $(images);\
	else\
		echo "No images to delete";\
	fi

fclean: down delete_images
	docker system prune -a --force

init_vault:
	rm -rf ./srcs/vault/data/*
	rm -rf ./srcs/vault/init/*
	rm -rf ./srcs/api/cred.env
	rm -rf ./srcs/api/cred.d

remove_log:
	rm -rf ./srcs/postgres/logs/*
	rm -rf ./srcs/vault/logs/*
	rm -rf ./srcs/redis/logs/*
	rm -rf ./srcs/nginx/logs/*
	rm -rf ./srcs/nginx/modlogs/*

.PHONY: all build up down delete_images fclean init_vault remove_log

.SILENT: all build up down delete_images fclean init_vault remove_log
