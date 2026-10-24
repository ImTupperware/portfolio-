#!/bin/bash
set -e

# Configure port dynamically based on Render's $PORT env var (defaults to 80)
TARGET_PORT="${PORT:-80}"
sed -i "s/Listen [0-9]*/Listen ${TARGET_PORT}/g" /etc/apache2/ports.conf
sed -i "s/<VirtualHost \*:[0-9]*>/<VirtualHost \*:${TARGET_PORT}>/g" /etc/apache2/sites-available/*.conf

# Cache configuration, routes, and views for production performance
php artisan config:cache || true
php artisan route:cache || true
php artisan view:cache || true

# Run database migrations if flagged
if [ "$RUN_MIGRATIONS" = "true" ]; then
    echo "Running database migrations..."
    php artisan migrate --force || true
fi

# Run seeder if flagged (useful for initial deploy)
if [ "$RUN_SEEDER" = "true" ]; then
    echo "Running database seeder..."
    php artisan db:seed --force || true
fi

# Execute Apache in foreground
exec apache2-foreground
