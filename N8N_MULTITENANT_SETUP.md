# N8N Multi-Tenant Authentication Setup Guide

## 1. CREATE USER CREDENTIALS TABLE IN N8N

**Steps:**
1. Go to N8N Dashboard → DataTables
2. Create new table: `user_credentials`
3. Add columns:
   - `id` (UUID or auto-increment) - Primary key
   - `email` (text) - Unique
   - `password_hash` (text) - Store hashed password (use bcrypt)
   - `user_id` (text) - Unique identifier for multi-tenant
   - `name` (text)
   - `created_at` (timestamp)
   - `is_active` (boolean)

**Sample Data:**
```json
{
  "id": "user_001",
  "email": "user@example.com",
  "password_hash": "password123",
  "user_id": "uuid-or-custom-id-001",
  "name": "Ahmed",
  "created_at": "2024-01-15",
  "is_active": true
}
```

## 2. IMPLEMENT LOGIN WORKFLOW (POST /login)

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response on Success:**
```json
{
  "user_id": "uuid-or-custom-id-001",
  "token": "TOKEN_1704067200000_abc123def",
  "email": "user@example.com",
  "expires_at": "2024-01-22",
  "message": "تم تسجيل الدخول بنجاح ✅"
}
```

**Response on Error:**
```json
{
  "error": "كلمة المرور غير صحيحة",
  "message": "فشل تسجيل الدخول"
}
```

## 3. MODIFY EXISTING PRODUCT ENDPOINTS FOR MULTI-TENANT

### 3.1 Modify GET /Respond immediately
Add user_id validation to fetch only user's products:

```javascript
// Add this Code node AFTER the Trigger webhook
const { user_id, token } = $json.body;

if (!user_id || !token) {
  throw new Error('user_id و token مطلوبان');
}

// Pass user_id to DataTable filter
return [{
  json: {
    user_id: user_id,
    token: token
  }
}];
```

**Update DataTable "Fetch Products" filter:**
- Add condition: `user_id = {{$json.user_id}}`

### 3.2 Modify POST /add-product
Add user_id to request validation:

```javascript
// Update existing "Validate Product" node
const { email, name, description, price, images, user_id, token } = $json.body;

// Validate authentication
if (!user_id || !token) {
  throw new Error('Authentication required: user_id و token مطلوبان');
}

// Existing validation...
if (!name) errors.push('الاسم مفقود');
if (!description) errors.push('الوصف مفقود');
if (!price) errors.push('السعر مفقود');

// Add user_id to output
return [{
  json: {
    name,
    description,
    price,
    user_id,        // ← NEW
    email,           // ← NEW (optional, for tracking)
    images,
    text: `${name} - ${description}`
  }
}];
```

**Update "Upsert row(s)1" to include user_id:**
```
Add column mapping: user_id = {{$json.user_id}}
```

### 3.3 Modify POST /update-product
Similar to add-product:
```javascript
const { product_id, user_id, token, name, description, price } = $json.body;

// Verify user_id matches product owner
// (Add extra validation node if needed)

return [{
  json: {
    product_id,
    user_id,
    name,
    description,
    price
  }
}];
```

### 3.4 Modify POST /delete-product
Add user verification:
```javascript
const { product_id, user_id, token } = $json.body;

// Fetch product to verify ownership
// Then proceed with deletion only if user_id matches

return [{
  json: {
    product_id,
    user_id
  }
}];
```

## 4. FRONTEND INTEGRATION (ALREADY DONE)

Your React Native app already:
✅ Calls `/login` with email/password
✅ Stores user_id + token
✅ Injects token in Authorization header
✅ Includes user_id in POST request bodies
✅ Uses centralized API client with interceptors

## 5. PRODUCTION RECOMMENDATIONS

### Security Improvements:
1. **Use bcrypt for passwords:**
   ```javascript
   // In n8n Code node:
   const bcrypt = require('bcryptjs');
   const hashedPassword = await bcrypt.hash(password, 10);
   ```

2. **Use JWT tokens instead of simple tokens:**
   ```javascript
   // Use n8n HTTP Request node to call jwt.io or your auth server
   const jwt = require('jsonwebtoken');
   const token = jwt.sign(
     { user_id, email },
     'your-secret-key',
     { expiresIn: '7d' }
   );
   ```

3. **Add token validation to all endpoints:**
   - Verify token exists
   - Check token expiration
   - Match token to user_id

4. **Use HTTPS only:**
   - Ensure n8n endpoint uses HTTPS
   - Add CORS headers if needed

## 6. DATABASE SETUP (Alternative - Postgres)

If you prefer Postgres instead of n8n DataTable:

```sql
-- Create users table
CREATE TABLE user_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  user_id VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- Create products table with user_id
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(50) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2),
  image_url_1 VARCHAR(500),
  image_url_2 VARCHAR(500),
  image_url_3 VARCHAR(500),
  image_url_4 VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES user_credentials(user_id)
);

-- Create index for faster queries
CREATE INDEX idx_products_user_id ON products(user_id);
```

Then replace n8n DataTable nodes with Postgres nodes.

## 7. TESTING FLOW

1. **Test Login:**
   ```bash
   curl -X POST http://your-n8n-host/webhook/login \
     -H "Content-Type: application/json" \
     -d '{
       "email": "user@example.com",
       "password": "password123"
     }'
   ```

2. **Test Get Products (Multi-Tenant):**
   ```bash
   curl -X POST http://your-n8n-host/webhook/Respond-immediately \
     -H "Content-Type: application/json" \
     -d '{
       "user_id": "uuid-001",
       "token": "TOKEN_..._..."
     }'
   ```

3. **Test Add Product:**
   ```bash
   curl -X POST http://your-n8n-host/webhook/add-product \
     -H "Content-Type: application/json" \
     -d '{
       "user_id": "uuid-001",
       "token": "TOKEN_..._...",
       "name": "منتج جديد",
       "description": "وصف",
       "price": 50,
       "image_base64_1": "data:image/png;base64,..."
     }'
   ```

## 8. NEXT STEPS

1. ✅ Create `user_credentials` DataTable in n8n
2. ✅ Add login webhook using provided JSON
3. ✅ Add user_id to existing DataTable schema (add column to products table)
4. ✅ Update product endpoints to filter by user_id
5. ✅ Test full flow: Login → Get Products → Add Product
6. ✅ Deploy and test with mobile app
