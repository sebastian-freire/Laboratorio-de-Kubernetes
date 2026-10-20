#!/bin/sh
# Crea la base de pruebas (<POSTGRES_DB>_test) la primera vez que se inicializa el volumen.
set -e
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
	CREATE DATABASE "${POSTGRES_DB}_test" OWNER "$POSTGRES_USER";
EOSQL
