#!/bin/bash

wait_for_postgres() {
    echo "Waiting for PostgreSQL to be ready..."
    while ! nc -z postgresdb 5432; do
        sleep 1
    done
    echo "PostgreSQL is ready."
}

# Call the function to wait for PostgreSQL
wait_for_postgres

if [ -f ../.env ]; then
  source ../.env
fi


create_database() {
  PGPASSWORD="$POSTGRES_PASSWORD" psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --host postgresdb <<-EOSQL
    CREATE DATABASE "$POSTGRES_DATABASE" WITH OWNER "$POSTGRES_USER" TEMPLATE template0;
EOSQL
}


apt-get update && apt-get install -y postgresql-client


echo "Creating database if it does not exist..."
create_database || echo "Database already exists or creation failed."

# Run migrations and seeds
npm run migrate:reset

# Start the application
exec "$@"