#!/bin/bash

# DoItAllBros Deployment Script
# This script builds and deploys your site to your VPS

echo "🚀 DoItAllBros Deployment Script"
echo "================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Run this script from the doitallbros directory."
    exit 1
fi

# Step 1: Install dependencies (if needed)
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Step 2: Build the project
echo "🔨 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed! Check the errors above."
    exit 1
fi

echo "✅ Build successful!"

# Step 3: Deploy to VPS (you'll need to configure this)
echo ""
echo "📤 To deploy to your VPS, run ONE of these commands:"
echo ""
echo "Option 1 - Using rsync (recommended):"
echo "rsync -avz --delete dist/ username@your-vps-ip:/var/www/html/doitallbros/"
echo ""
echo "Option 2 - Using scp:"
echo "scp -r dist/* username@your-vps-ip:/var/www/html/doitallbros/"
echo ""
echo "Option 3 - Use FileZilla/WinSCP:"
echo "Upload the contents of the 'dist' folder to /var/www/html/doitallbros/"
echo ""
echo "🎉 Build complete! The 'dist' folder is ready to deploy."

# Optional: Uncomment and configure this section for automatic deployment
# DEPLOY_USER="your-username"
# DEPLOY_HOST="your-vps-ip"
# DEPLOY_PATH="/var/www/html/doitallbros"
# 
# echo "Deploying to $DEPLOY_HOST..."
# rsync -avz --delete dist/ $DEPLOY_USER@$DEPLOY_HOST:$DEPLOY_PATH/
# 
# if [ $? -eq 0 ]; then
#     echo "✅ Deployment successful!"
# else
#     echo "❌ Deployment failed!"
#     exit 1
# fi
