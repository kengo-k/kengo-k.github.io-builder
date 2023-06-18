dev:
	hugo -D serve

build:
	hugo

run:
	hugo && npx http-server -p 80 public
