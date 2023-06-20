dev:
	hugo -D -F serve

build:
	hugo

run:
	hugo && npx http-server -p 80 public
