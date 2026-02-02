# N8N Login Workflow - Manual Setup Guide

If you're getting "Could not import file" error, follow this manual setup instead. It's actually faster and ensures everything is configured correctly.

---

## Step 1: Create Webhook Node (POST /login)

1. Open N8N Dashboard → Workflows
2. **Click "+ Add node"** → Search **"Webhook"**
3. Select **"Webhook"** node
4. Configure:
   - **HTTP Method:** POST
   - **Path:** `login` (without leading slash)
   - **Response Mode:** "Respond with a node"
   - Click **"Save"**

---

## Step 2: Add Validate Credentials Node

1. Click the Webhook node → **"+"** output
2. **Add node** → Search **"Code"** → Select **"Code"**
3. Copy-paste this code:

```javascript
const { email, password } = $json.body;

if (!email || !password) {
  throw new Error('البريد الإلكتروني وكلمة المرور مطلوبان');
}

if (!email.includes('@')) {
  throw new Error('البريد الإلكتروني غير صحيح');
}

if (password.length < 6) {
  throw new Error('كلمة المرور يجب أن تكون 6 أحرف على الأقل');
}

return [{
  json: {
    email: email.toLowerCase().trim(),
    password: password,
    timestamp: new Date().toISOString()
  }
}];
```

4. Rename to: **"Validate Credentials"**
5. Click **"Save"**

---

## Step 3: Add Get User from DB Node

1. Connect from Validate Credentials
2. **Add node** → Search **"DataTable"** → Select **"DataTable"**
3. Configure:
   - **Operation:** Get
   - **Data Table:** Select `user_credentials` table
   - **Filters:**
     - Click **"Add condition"**
     - **Column:** `email`
     - **Equals:** `={{$json.email}}`
   - **Return all results:** OFF
   - Click **"Save"**
4. Rename to: **"Get User from DB"**

---

## Step 4: Add IF Node (User Exists?)

1. Connect from Get User from DB
2. **Add node** → Search **"If"** → Select **"If"**
3. Configure condition:
   - **Compare:** `$json.length` (left side)
   - **Operation:** "Does not equal"
   - **Value:** `0` (right side)
   - Click **"Save"**
4. Rename to: **"User Exists?"**
5. This creates two outputs: TRUE (user found) and FALSE (user not found)

---

## Step 5: Add Extract User Record Node (TRUE path)

1. From IF node → **TOP output** (TRUE path)
2. **Add node** → **"Code"**
3. Copy-paste:

```javascript
const users = $json;
if (!Array.isArray(users) || users.length === 0) {
  throw new Error('لم يتم العثور على المستخدم');
}

const userRecord = users[0].json || users[0];
return [{
  json: userRecord
}];
```

4. Rename to: **"Extract User Record"**

---

## Step 6: Add Verify Password Node

1. Connect from Extract User Record
2. **Add node** → **"Code"**
3. Copy-paste:

```javascript
const userRecord = $json;
const submittedPassword = $node['Validate Credentials'].json.password;
const storedPassword = userRecord.password_hash || userRecord.password;

const passwordMatch = submittedPassword === storedPassword;

if (!passwordMatch) {
  throw new Error('كلمة المرور غير صحيحة');
}

if (!userRecord.id && !userRecord.user_id) {
  throw new Error('معرف المستخدم غير موجود في السجل');
}

const token = 'TOKEN_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
const userId = userRecord.id || userRecord.user_id;

return [{
  json: {
    user_id: userId,
    email: userRecord.email,
    name: userRecord.name || '',
    token: token,
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  }
}];
```

4. Rename to: **"Verify Password & Generate Token"**

---

## Step 7: Add Success Response Node

1. Connect from "Verify Password & Generate Token"
2. **Add node** → Search **"Respond to Webhook"** → Select **"Respond to Webhook"**
3. Configure:
   - **Response Body Type:** JSON
   - **Body:**

```json
{
  "success": true,
  "user_id": "={{ $json.user_id }}",
  "token": "={{ $json.token }}",
  "email": "={{ $json.email }}",
  "name": "={{ $json.name }}",
  "expires_at": "={{ $json.expires_at }}",
  "message": "تم تسجيل الدخول بنجاح ✅"
}
```

4. Rename to: **"Respond Success"**

---

## Step 8: Add User Not Found Response (FALSE path)

1. From IF node → **BOTTOM output** (FALSE path)
2. **Add node** → **"Respond to Webhook"**
3. Configure:
   - **Response Body Type:** JSON
   - **Body:**

```json
{
  "success": false,
  "error": "البريد الإلكتروني غير مسجل",
  "message": "هذا البريد الإلكتروني لم يتم تسجيله في النظام"
}
```

4. Rename to: **"Respond - User Not Found"**

---

## Step 9: Connection Verification

Your workflow should look like this:

```
POST /login
    ↓
Validate Credentials
    ↓
Get User from DB
    ↓
User Exists? ──TRUE──→ Extract User Record
    ↓                      ↓
  FALSE                    ↓
    ↓          Verify Password & Generate Token
    ↓                      ↓
    └─→ Respond - User    Respond Success
        Not Found
```

**Check connections:**
- Webhook → Validate Credentials ✅
- Validate Credentials → Get User from DB ✅
- Get User from DB → User Exists? ✅
- User Exists? (YES) → Extract User Record ✅
- User Exists? (NO) → Respond - User Not Found ✅
- Extract User Record → Verify Password & Generate Token ✅
- Verify Password & Generate Token → Respond Success ✅

---

## Step 10: Test the Workflow

1. Click **"Test"** button (or Save first)
2. Click **"Execute Workflow"**
3. For **Request Body**, enter:

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

4. Click **"Send Test Message"**

### Expected Results:

**Test 1: Valid Credentials ✅**
```json
{
  "success": true,
  "user_id": "seller-001",
  "token": "TOKEN_1704067200000_abc123",
  "email": "user@example.com",
  "name": "Ahmed",
  "expires_at": "2024-02-03T12:00:00.000Z",
  "message": "تم تسجيل الدخول بنجاح ✅"
}
```

**Test 2: Wrong Password ❌**
```json
{
  "success": false,
  "error": "كلمة المرور غير صحيحة",
  "message": "فشل تسجيل الدخول"
}
```

**Test 3: User Not Found ❌**
```json
{
  "success": false,
  "error": "البريد الإلكتروني غير مسجل",
  "message": "هذا البريد الإلكتروني لم يتم تسجيله في النظام"
}
```

---

## Step 11: Verify DataTable

Before testing, ensure your `user_credentials` table has:
- Column: `email` (Text)
- Column: `password_hash` (Text) - or `password`
- Column: `id` or `user_id` (Text)
- Column: `name` (Text, optional)

### Sample Record:
```
email: user@example.com
password_hash: password123
id: seller-001
name: Ahmed
```

---

## Troubleshooting

### "Error: lم يتم العثور على المستخدم"
- User not found in DataTable
- Check email matches exactly (case-sensitive)
- Verify DataTable has the user record

### "Error: كلمة المرور غير صحيحة"
- Password stored in table doesn't match
- Check `password_hash` column contains correct password

### "Error: معرف المستخدم غير موجود"
- Your DataTable record missing `id` or `user_id` field
- Add this column to your table

### "Webhook path already in use"
- If getting this error, use different path like `login2` or `auth-login`
- Update frontend API_ENDPOINTS to match

---

## Using the Corrected JSON File (Alternative)

If manual setup is tedious, use the corrected JSON:

1. Download: `login-workflow-n8n.json`
2. In N8N Dashboard → **Workflows**
3. Click **"..."** menu
4. Select **"Import"**
5. Choose the JSON file
6. Click **"Import"**

---

## Next Steps

✅ Complete manual setup OR import the JSON file
✅ Test all 3 scenarios above
✅ Verify workflow is active
✅ Test frontend login: `npm start`
