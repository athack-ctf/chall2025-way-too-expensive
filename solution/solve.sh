#!/bin/bash

BASE_URL='http://localhost:2025'

curl "${BASE_URL}/api/add-to-cart/101" \
  -X 'POST' \
  -H 'Content-Type: application/json'

curl "${BASE_URL}/api/buy" \
  -X 'POST' \
  -H 'Content-Type: application/json' &

curl "${BASE_URL}/api/add-to-cart/99999" \
  -X 'POST' \
  -H 'Content-Type: application/json'