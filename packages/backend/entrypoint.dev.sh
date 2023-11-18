#!/bin/sh

if [ "$SKIP_MIGRATION_IN_DEV" != "true" ]; then
  yarn run -T migration:run
fi

yarn run -T start:dev
