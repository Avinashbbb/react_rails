#!/bin/sh

set -e

if [ -f tmp/pids/server.pid ]; then
  rm tmp/pids/server.pid
fi

bundle
bundle exec puma -C ./config/puma.rb -b tcp://0.0.0.0:3000 &
cd /app/client && yarn build:development
#tail -f /dev/null
