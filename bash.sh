#!/bin/bash

# Find all .js files in src/ and rename them to .jsx
find src -type f -name "*.js" -exec bash -c 'mv "$0" "${0%.js}.jsx"' {} \;

echo "All .js files in src/ (including subdirectories) renamed to .jsx"
