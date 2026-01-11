#!/bin/bash

# Admin Dashboard Pre-flight Check Script
# Run this before manual testing to ensure everything is ready

echo "🚀 Vasukriti - Admin Dashboard Pre-flight Check"
echo "=================================================="
echo ""

# Check if backend is running
echo "1️⃣  Checking Backend Server..."
if lsof -Pi :5001 -sTCP:LISTEN -t >/dev/null ; then
    echo "   ✅ Backend running on port 5001"
else
    echo "   ❌ Backend NOT running!"
    echo "   → Start with: cd backend && npm run dev"
    exit 1
fi

# Check if frontend is running
echo ""
echo "2️⃣  Checking Frontend Server..."
if lsof -Pi :3000 -sTCP:LISTEN -t >/dev/null ; then
    echo "   ✅ Frontend running on port 3000"
else
    echo "   ❌ Frontend NOT running!"
    echo "   → Start with: cd frontend && npm run dev"
    exit 1
fi

# Check backend health
echo ""
echo "3️⃣  Checking Backend Health..."
HEALTH_CHECK=$(curl -s http://localhost:5001/api/auth/me -o /dev/null -w "%{http_code}")
if [ "$HEALTH_CHECK" == "200" ] || [ "$HEALTH_CHECK" == "401" ]; then
    echo "   ✅ Backend API responding"
else
    echo "   ⚠️  Backend API might have issues (HTTP $HEALTH_CHECK)"
fi

# Check MongoDB connection
echo ""
echo "4️⃣  Checking Database..."
DB_CHECK=$(curl -s http://localhost:5001/api/categories | grep -o "success" | head -1)
if [ "$DB_CHECK" == "success" ]; then
    echo "   ✅ Database connected"
else
    echo "   ⚠️  Database connection issue"
fi

# Test data check
echo ""
echo "5️⃣  Checking Test Data..."
PRODUCTS=$(curl -s http://localhost:5001/api/products | grep -o "\"totalProducts\":[0-9]*" | grep -o "[0-9]*")
CATEGORIES=$(curl -s http://localhost:5001/api/categories | grep -c "name")
ORDERS=$(curl -s http://localhost:5001/api/orders | grep -c "orderNumber")

echo "   📦 Products: $PRODUCTS"
echo "   📁 Categories: $CATEGORIES"
echo "   🛒 Orders: $ORDERS"

if [ "$PRODUCTS" -gt 0 ] && [ "$CATEGORIES" -gt 0 ]; then
    echo "   ✅ Test data present"
else
    echo "   ⚠️  Test data might be missing"
    echo "   → Re-seed with: cd backend && node seed.js"
fi

echo ""
echo "=================================================="
echo " System Status: READY FOR TESTING"
echo ""
echo "📋 Next Steps:"
echo "   1. Open http://localhost:3000/admin"
echo "   2. Login with: admin@vasukritijewels.com / Test123456"
echo "   3. Follow ADMIN_TESTING_CHECKLIST.md"
echo ""
echo "💡 Tips:"
echo "   - Open browser DevTools (F12) to monitor network requests"
echo "   - Check backend terminal for API logs"
echo "   - Document any bugs in ADMIN_TESTING_CHECKLIST.md"
echo ""
