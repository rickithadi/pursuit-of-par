#!/bin/bash

# TPC Sawgrass Golf Simulation - Deployment Script
# Enhanced 3D version with authentic 1987 board game mechanics

echo "🎲 Deploying In Pursuit of Par - Enhanced Golf Simulation"
echo "============================================================"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Login check
echo "🔐 Checking Vercel authentication..."
if ! vercel whoami &> /dev/null; then
    echo "⚠️  Please login to Vercel first:"
    echo "   vercel login"
    exit 1
fi

echo "✅ Vercel CLI ready"

# Deploy to production
echo ""
echo "🚀 Deploying to production..."
echo "Please respond to the prompts:"
echo "  1. Set up and deploy? → y"
echo "  2. Which scope? → hadi rickit"  
echo "  3. Link to existing project? → n"
echo "  4. Project name? → pursuit-of-par"
echo "  5. Directory? → [press enter]"

vercel --prod

# Check if deployment was successful
if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Deployment successful!"
    echo ""
    echo "🌐 Adding custom domain..."
    vercel domains add golf.rickithadi.dev
    
    echo ""
    echo "🔗 Linking domain to deployment..."
    vercel alias golf.rickithadi.dev
    
    echo ""
    echo "🎉 Deployment Complete!"
    echo "============================================================"
    echo "Your enhanced golf simulation is now live at:"
    echo "  🏠 https://golf.rickithadi.dev/"
    echo "  🎮 https://golf.rickithadi.dev/game (Classic)"
    echo "  ✨ https://golf.rickithadi.dev/3d (Enhanced 3D)"
    echo "  📖 https://golf.rickithadi.dev/rules"
    echo "  🧪 https://golf.rickithadi.dev/test"
    echo ""
    echo "Features deployed:"
    echo "  ✅ Authentic 1987 board game mechanics"
    echo "  ✅ Three.js 3D course visualization"
    echo "  ✅ 4-player digital scorecard"
    echo "  ✅ TPC Sawgrass tournament data"
    echo "  ✅ Mobile-responsive design"
    echo "============================================================"
else
    echo "❌ Deployment failed. Please check the error messages above."
fi