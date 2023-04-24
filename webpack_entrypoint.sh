#!/bin/sh

set -e

cd /app/client
yarn clean
yarn build:development
