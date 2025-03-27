#! /bin/bash

docker exec -it -e PGPASSWORD=deeporigin deeporigin-postgres-1 psql -U deeporigin
