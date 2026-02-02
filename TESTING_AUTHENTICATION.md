# Authentication Testing Guide

## Your Setup
- **N8N Login Endpoint:** https://n8n-n8n.17m6co.easypanel.host/webhook/login
- **Frontend App:** Running on http://localhost:19006 (web) or native

## Step 1: Test N8N Login Endpoint (Direct)

### Using cURL:
```bash
curl -X POST https://n8n-n8n.17m6co.easypanel.host/webhook/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-user@example.com",
    "password": "your-password"
  }'
```

### Expected Response (Success):
```json
{
  "user_id": "uuid-or-custom-id",
  "token": "TOKEN_1704067200000_abc123def",
  "email": "your-user@example.com",
  "expires_at": "2024-01-22",
  "message": "تم تسجيل الدخول بنجاح ✅"
}
```

### Expected Response (Error):
```json
{
  "error": "كلمة المرور غير صحيحة",
  "message": "فشل تسجيل الدخول"
}
```

---

## Step 2: Test Frontend Login

1. **Start the app on web:**
   ```bash
   npm start
   ```
   Open http://localhost:19006

2. **You should see the Login Screen** with:
   - Email input field
   - Password input field
   - Login button

3. **Enter your credentials:**
   - Email: `your-user@example.com`
   - Password: `your-password`

4. **Click Login**

### What Happens Behind the Scenes:
- ✅ `LoginScreen.js` calls `AuthContext.login(credentials)`
- ✅ `AuthContext` calls `loginRequest()` from `authApi.js`
- ✅ `authApi.js` sends POST to `https://n8n-n8n.17m6co.easypanel.host/webhook/login`
- ✅ Response includes `user_id` and `token`
- ✅ `AuthContext` stores both using `authService`
- ✅ App navigates to `ProductListScreen`

---

## Step 3: Debug Checklist

### If Login Fails:

1. **Check N8N DataTable:**
   - Go to N8N Dashboard → DataTables
   - Verify `user_credentials` table exists
   - Verify your test user record exists with:
     - `email`: matches what you entered
     - `password_hash`: contains password
     - `user_id`: has a value

2. **Check N8N Workflow:**
   - Go to N8N Dashboard → Workflows
   - Open your login workflow
   - Verify webhook path is exactly `login` (not `/login`)
   - Run test with sample data

3. **Check Network in Browser:**
   - Open Chrome DevTools → Network tab
   - Look for POST to `n8n-n8n.17m6co.easypanel.host/webhook/login`
   - Check response status (should be 200 for success, 400/401 for error)
   - Check response body for error message

4. **Check App Logs:**
   - In terminal where `npm start` runs
   - Look for errors from `LoginScreen` or `AuthContext`
   - Look for `console.error` messages

---

## Step 4: If Login Succeeds

After successful login, you should see:

1. **ProductListScreen** displayed (instead of LoginScreen)
2. **Products list** with your products
3. **FAB button** (Floating Action Button) to add products

### Verify Multi-Tenant Integration:

The app now automatically:
- ✅ Stores `user_id` and `token` securely
- ✅ Injects `user_id` into every POST request body
- ✅ Adds `Authorization: Bearer <token>` header
- ✅ Fetches only products belonging to this user

---

## Step 5: Test Product Operations

### Test Get Products (Multi-Tenant):
```bash
curl -X POST https://n8n-n8n.17m6co.easypanel.host/webhook/get-products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN_1704067200000_abc123def" \
  -d '{
    "user_id": "uuid-or-custom-id"
  }'
```

### Test Add Product:
```bash
curl -X POST https://n8n-n8n.17m6co.easypanel.host/webhook/add-product \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN_1704067200000_abc123def" \
  -d '{
    "user_id": "uuid-or-custom-id",
    "name": "Test Product",
    "description": "Test Description",
    "price": 50,
    "image_base64_1": "data:image/png;base64,..."
  }'
```

---

## Troubleshooting

### "Missing authentication token" error
- Your N8N token validation might be failing
- Check that `user_id` and `token` are being sent correctly
- Verify they're stored in secure storage after login

### "Login endpoint returned 400" or "Invalid email"
- The N8N webhook might not have your user created yet
- Go to N8N DataTable and manually add a user record
- Or fix the password validation logic in your N8N workflow

### "Cannot GET /webhook/login" or "404"
- Check webhook path in N8N workflow
- Should be exactly `login` (without leading slash)
- Verify webhook is active (not disabled)

### Products not filtering by user_id
- Check that N8N `Fetch Products` node has a filter for `user_id`
- Your product endpoints need to accept `user_id` in the request body
- Update the product endpoints using the guide in `N8N_MULTITENANT_SETUP.md`

---

## Files Updated

1. **src/config/apiConfig.js** - Added LOGIN endpoint
2. **src/api/authApi.js** - Updated to use actual N8N URL
3. **src/context/AuthContext.js** - Already properly configured
4. **src/screens/LoginScreen.js** - Already properly configured

## Next Steps

1. ✅ Test login endpoint with cURL
2. ✅ Test frontend login screen
3. ✅ Verify products display after login
4. ✅ Test adding/editing/deleting products
5. ✅ Update N8N product endpoints to filter by user_id (see N8N_MULTITENANT_SETUP.md)
