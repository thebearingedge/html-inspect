#!/bin/sh

set -e

rm -rf dist/ &&

(
  npx tsc --project 'tsconfig.prod.json' \
          --declaration \
          --emitDeclarationOnly \
          --outDir 'dist/'
) &

(
  npx tsc --project 'tsconfig.prod.json' \
          --module 'commonjs' \
          --outDir 'dist/cjs/' &&
  cat > dist/cjs/package.json << EOF
{
  "type": "commonjs"
}
EOF
) &

(
  npx tsc --project 'tsconfig.prod.json' \
          --module 'esnext' \
          --outDir 'dist/esm/' &&
  cat > dist/esm/package.json << EOF
{
  "type": "module"
}
EOF
) &

wait
