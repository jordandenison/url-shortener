#! /bin/bash

docker exec -it -e PGPASSWORD=urlshortener url-shortener-postgres-test-1 psql -U urlshortener
