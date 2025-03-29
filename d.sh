#! /bin/bash

docker exec -it -e PGPASSWORD=urlshortener url-shortener-postgres-1 psql -U urlshortener
