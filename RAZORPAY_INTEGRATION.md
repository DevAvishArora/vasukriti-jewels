# Razorpay Integration Guide

## Setup Complete! ✅

Razorpay payment gateway has been integrated into your Vasukriti e-commerce store.

## Features Implemented

1. **Backend API Endpoints**:
   - `POST /api/payment/create-order` - Create Razorpay order
   - `POST /api/payment/verify` - Verify payment signature
   - `GET /api/payment/status/:orderId` - Get payment status
   - `POST /api/payment/webhook` - Handle Razorpay webhooks

2. **Frontend Integration**:
   - Razorpay checkout modal integrated in checkout page
   - Automatic payment verification
   - Order status updates after successful payment
   - Support for both Razorpay and COD payment methods

3. **Security**:
   - Payment signature verification using HMAC SHA256
   - Secure payment flow with server-side validation
   - Order model updated with Razorpay transaction details

## How to Get Razorpay Test Keys

1. **Sign up for Razorpay**:
   - Go to https://razorpay.com/
   - Click "Sign Up" and create an account
   - Complete the registration process

2. **Access Test Mode**:
   - After logging in, you'll see a toggle in the sidebar
   - Make sure "Test Mode" is enabled (it's enabled by default)
   - Test mode keys are free and don't require any verification

3. **Get Your API Keys**:
   - Go to Dashboard → Settings → API Keys
   - Click "Generate Test Key" if you don't see keys
   - You'll see:
     - **Key ID** (starts with `rzp_test_`)
     - **Key Secret** (click "Show" to reveal)

4. **Add Keys to Your Project**:

   **Backend** (`/backend/.env`):
   ```env
   RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXX
   RAZORPAY_KEY_SECRET=YOUR_SECRET_KEY_HERE
   ```

   **Frontend** (`/frontend/.env.local`):
   ```env
   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXX
   ```

## Testing the Integration

### Test Cards (Use these in Test Mode)

Razorpay provides test cards that simulate different scenarios:

**Successful Payment**:
- Card Number: `4111 1111 1111 1111`
- CVV: Any 3 digits
- Expiry: Any future date
- Name: Any name

**Failed Payment**:
- Card Number: `4000 0000 0000 0002`
- This card will always fail

**Other Test Cards**:
- **Mastercard**: `5555 5555 5555 4444`
- **Amex**: `3782 822463 10005`
- **Visa**: `4012 8888 8888 1881`

### UPI Testing

In test mode, use these UPI IDs:
- **Success**: `success@razorpay`
- **Failure**: `failure@razorpay`

### Testing Steps

1. **Start your servers**:
   ```bash
   # Backend
   cd backend
   npm run dev

   # Frontend (in another terminal)
   cd frontend
   npm run dev
   ```

2. **Add items to cart**:
   - Browse products and add to cart
   - Go to checkout

3. **Fill shipping details**:
   - Complete the shipping form
   - Proceed to payment

4. **Select Razorpay payment**:
   - Choose "Razorpay" as payment method
   - Click "Place Order"

5. **Complete test payment**:
   - Razorpay modal will open
   - Use test card: `4111 1111 1111 1111`
   - Enter any CVV and future expiry date
   - Click "Pay"

6. **Verify success**:
   - Payment should be verified automatically
   - You'll be redirected to order confirmation
   - Check backend logs for payment verification

## Production Deployment

When you're ready to go live:

1. **Complete Razorpay KYC**:
   - Submit business documents
   - Wait for verification (usually 24-48 hours)

2. **Switch to Live Mode**:
   - Toggle "Live Mode" in Razorpay dashboard
   - Generate new Live API keys (starts with `rzp_live_`)

3. **Update Environment Variables**:
   - Replace test keys with live keys in production `.env`
   - **Never commit live keys to Git!**

4. **Setup Webhook** (Optional but recommended):
   - Go to Dashboard → Settings → Webhooks
   - Add your webhook URL: `https://yourdomain.com/api/payment/webhook`
   - Select events: `payment.captured`, `payment.failed`
   - Copy webhook secret and add to `.env`:
     ```env
     RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
     ```

5. **Test in Production**:
   - Use small amounts for initial tests
   - Verify payment flow works correctly
   - Check order status updates

## Troubleshooting

### Issue: "Payment gateway failed to load"
- Check if Razorpay script is loading (check browser console)
- Verify RAZORPAY_KEY_ID is set in environment variables

### Issue: "Payment verification failed"
- Check if RAZORPAY_KEY_SECRET is correct in backend `.env`
- Verify payment signature is being sent from frontend
- Check backend logs for verification errors

### Issue: Order created but payment not updating
- Check if `/api/payment/verify` endpoint is being called
- Verify orderId is being passed correctly
- Check if Order model has `paymentInfo` fields

### Issue: Razorpay modal not opening
- Check browser console for errors
- Verify Razorpay script loaded successfully
- Check if `window.Razorpay` is available

## Current Implementation Status

✅ Backend payment controller created
✅ Payment routes registered
✅ Razorpay SDK installed
✅ Frontend checkout updated
✅ Payment verification flow implemented
✅ Order model supports Razorpay fields
✅ Error handling and user feedback
⏳ Add test keys and test the flow

## Next Steps

1. Get Razorpay test keys from dashboard
2. Add keys to `.env` files
3. Restart both servers
4. Test the complete checkout flow
5. Verify payment in Razorpay dashboard
6. Ready to deploy!

---

**Need Help?**
- Razorpay Documentation: https://razorpay.com/docs/
- Razorpay Support: https://razorpay.com/support/
- Test Credentials: https://razorpay.com/docs/payments/payments/test-card-details/
