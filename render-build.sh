#!/bin/bash
echo "Installing dependencies..."
npm install

echo "Generating Prisma client..."
npx prisma generate

echo "Building TypeScript..."
npx tsc

echo "Copying static files..."
cp -r src/data dist/data
cp -r src/uploads dist/uploads

echo "Build completed!"