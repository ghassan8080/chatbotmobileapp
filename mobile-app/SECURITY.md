# Security Best Practices - Product Management Mobile App

## 🔒 Current Security Implementation

### 1. API Authentication

**X-API-Key Header**
All API requests include an API key in headers:

```typescript
headers: {
  'X-API-Key': 'your-secret-api-key',
  'X-Request-Time': new Date().toISOString()
}
```

**Recommendation**: Generate a strong API key and store it securely:

```bash
# Generate secure API key
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Secure Storage

Sensitive data is stored using `react-native-encrypted-storage`:

```typescript
import EncryptedStorage from 'react-native-encrypted-storage';

// Store API key
await EncryptedStorage.setItem('api_key', apiKey);

// Retrieve API key
const key = await EncryptedStorage.getItem('api_key');
```

### 3. Input Validation & Sanitization

**Client-Side Validation**:
- Product name: 3-100 characters
- Description: 10-500 characters
- Price: Positive number, max 1,000,000
- Image size: Max 5MB per image

**Sanitization**:
```typescript
const sanitizeString = (input: string): string => {
  return input.replace(/[<>]/g, '').trim();
};
```

### 4. Image Upload Security

- **Size validation**: Max 5MB per image
- **Type validation**: Only JPEG, PNG, WebP allowed
- **Compression**: Images compressed before upload
- **Base64 encoding**: Binary-safe transmission

---

## 🛡️ Server-Side Security Recommendations

### 1. n8n Webhook Protection

**Add Authentication Middleware** in your n8n workflows:

```javascript
// Example n8n authentication node
const apiKey = $request.headers['x-api-key'];
const validKey = 'your-secret-api-key-here';

if (!apiKey || apiKey !== validKey) {
  return {
    statusCode: 401,
    body: {
      success: false,
      message: 'Unauthorized: Invalid API key'
    }
  };
}
```

**IP Whitelisting**:
- Restrict webhook access to specific IP ranges
- Use Cloudflare or similar WAF

**Rate Limiting**:
```javascript
// Implement rate limiting in n8n
const redis = // Redis connection
const key = `rate_limit:${$request.ip}`;
const count = await redis.incr(key);

if (count === 1) {
  await redis.expire(key, 60); // 1 minute window
}

if (count > 10) {
  return { statusCode: 429, body: { message: 'Too many requests' } };
}
```

### 2. Input Validation (Server)

**Always validate on server**:

```javascript
// Example n8n validation
const { name, description, price } = $json;

// Validate name
if (!name || name.length < 3 || name.length > 100) {
  return {
    statusCode: 400,
    body: { message: 'Invalid product name' }
  };
}

// Validate price
if (isNaN(price) || price <= 0) {
  return {
    statusCode: 400,
    body: { message: 'Invalid price' }
  };
}

// Sanitize inputs
const sanitizedName = name.replace(/[<>]/g, '').trim();
```

### 3. Image Upload Security

**Server-side validation**:

```javascript
// Validate base64 image
const imageData = $json.image_base64_1;

// Check size (base64 is ~1.33x original)
const sizeBytes = (imageData.length * 3) / 4;
const maxSize = 5 * 1024 * 1024; // 5MB

if (sizeBytes > maxSize) {
  return { statusCode: 413, body: { message: 'Image too large' } };
}

// Validate base64 format
if (!imageData.startsWith('data:image/')) {
  return { statusCode: 400, body: { message: 'Invalid image format' } };
}
```

**Malware Scanning**:
- Use ClamAV or similar for uploaded images
- Store images in isolated bucket

### 4. Database Security

**SQL Injection Prevention**:
```sql
-- Use parameterized queries
INSERT INTO products (name, description, price, seller_id)
VALUES ($1, $2, $3, $4);
```

**Access Control**:
- Implement row-level security
- Use least privilege principle
- Never expose database credentials in client

---

## 🔐 Environment Security

### Development vs Production

**Development** (`.env.development`):
```env
API_BASE_URL=http://localhost:5678/webhook
API_KEY=dev-key-12345
ENABLE_DEBUG_LOGS=true
```

**Production** (`.env.production`):
```env
API_BASE_URL=https://n8n-n8n.17m6co.easypanel.host/webhook
API_KEY=<STRONG_SECRET_KEY>
ENABLE_DEBUG_LOGS=false
```

### Secure Key Management

**Never commit `.env` files**:
```gitignoreenv
# .gitignore
.env
.env.local
.env.production
```

**Use environment-specific builds**:

```bash
# Android
ENVFILE=.env.production npm run android -- --variant=release

# iOS
ENVFILE=.env.production npm run ios -- --configuration Release
```

---

## 🚨 Common Vulnerabilities & Fixes

### 1. Man-in-the-Middle (MITM) Attacks

**Problem**: Unencrypted HTTP traffic

**Solution**: Always use HTTPS

```typescript
// In api.config.ts
const apiBaseUrl = process.env.API_BASE_URL;

if (!apiBaseUrl.startsWith('https://') && !__DEV__) {
  throw new Error('Production must use HTTPS');
}
```

**Certificate Pinning** (Advanced):
```typescript
// Install: npm install react-native-ssl-pinning

import { fetch as sslFetch } from 'react-native-ssl-pinning';

const response = await sslFetch('https://api.example.com', {
  method: 'POST',
  sslPinning: {
    certs: ['certificate'],
  },
});
```

### 2. Hardcoded Secrets

**Problem**:
```typescript
// ❌ BAD
const API_KEY = 'abc123secretkey';
```

**Solution**:
```typescript
// ✅ GOOD
import Config from 'react-native-config';
const API_KEY = Config.API_KEY;
```

### 3. Logging Sensitive Data

**Problem**:
```typescript
// ❌ BAD
console.log('API Request:', { apiKey: 'secret123', payload });
```

**Solution**:
```typescript
// ✅ GOOD
if (__DEV__) {
  console.log('API Request:', { url, method });
}
```

### 4. Insecure Local Storage

**Problem**:
```typescript
// ❌ BAD - AsyncStorage is not encrypted
import AsyncStorage from '@react-native-async-storage/async-storage';
await AsyncStorage.setItem('apiKey', apiKey);
```

**Solution**:
```typescript
// ✅ GOOD - Use encrypted storage
import EncryptedStorage from 'react-native-encrypted-storage';
await EncryptedStorage.setItem('apiKey', apiKey);
```

---

## 🔍 Security Testing Checklist

- [ ] All API endpoints use HTTPS in production
- [ ] API key is stored securely (encrypted storage)
- [ ] No hardcoded secrets in source code
- [ ] Input validation on both client and server
- [ ] Rate limiting implemented
- [ ] Image size/type validation
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (input sanitization)
- [ ] Proper error handling (no sensitive info leaked)
- [ ] Debug logs disabled in production
- [ ] Certificate pinning (optional, for high security)
- [ ] Regular dependency updates (`npm audit`)

---

## 🔄 Regular Maintenance

### Dependency Security

```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Update dependencies
npm update
```

### Code Review Checklist

- ✅ No console.log with sensitive data
- ✅ No hardcoded credentials
- ✅ Proper error handling
- ✅ Input validation present
- ✅ HTTPS only in production

---

## 📞 Incident Response

If security breach occurs:

1. **Immediate**: Rotate all API keys
2. **Investigate**: Check server logs for unauthorized access
3. **Notify**: Alert users if data compromised
4. **Patch**: Fix vulnerability ASAP
5. **Release**: Push emergency update

---

## 📚 Additional Resources

- [OWASP Mobile Security](https://owasp.org/www-project-mobile-security/)
- [React Native Security Guide](https://reactnative.dev/docs/security)
- [n8n Security Best Practices](https://docs.n8n.io/hosting/security/)

---

**Security is an ongoing process, not a one-time task!**
