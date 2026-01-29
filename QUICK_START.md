# Quick Start Guide

## 🚀 Getting Started (5 minutes)

### Step 1: Generate JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Copy the output (should be 64 characters long).

### Step 2: Configure Environment
```bash
# Create .env file from template
cp .env.example .env
```

Edit `.env` and add:
```env
JWT_SECRET=<paste-your-generated-secret-here>
DATABASE_URL=mysql://user:password@localhost:3306/database
DB_HOST=localhost
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
NODE_ENV=development
```

### Step 3: Install & Run
```bash
# Install dependencies (if not already done)
npm install

# Run development server
npm run dev
```

### Step 4: Verify
Visit `http://localhost:3000` - The app should start without errors.

---

## ✅ What Was Fixed

### Critical Security Issues (All Fixed ✅)
- ✅ **Authentication bypass** - Middleware now properly protects routes
- ✅ **SQL injection** - All inputs sanitized
- ✅ **No input validation** - Zod schemas added
- ✅ **Weak JWT secrets** - Now validated on startup
- ✅ **No rate limiting** - Brute force protection added
- ✅ **Admin access control** - Role-based authorization implemented
- ✅ **Password exposure** - Sensitive data excluded from responses
- ✅ **File upload risks** - Type, size validation added
- ✅ **Token security** - Using httpOnly cookies
- ✅ **Token invalidation** - Logout now works properly

---

## 🔒 Security Features Added

### 1. Proper Authentication
- JWT tokens with proper validation
- httpOnly cookies (XSS protection)
- Token rotation on refresh
- Secure token storage

### 2. Authorization
- Role-based access control (RBAC)
- Admin routes protected
- User info passed via secure headers

### 3. Input Validation
- Zod schemas for all inputs
- Email validation
- Password strength requirements
- File type/size validation

### 4. Rate Limiting
- 5 login attempts per 15 minutes
- 429 status code on limit exceeded
- Per-email tracking

### 5. Security Headers
- Strict-Transport-Security
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection
- Referrer-Policy
- Permissions-Policy

### 6. Data Protection
- Passwords excluded from API responses
- Refresh tokens in database only
- SQL injection prevention
- Path traversal protection

---

## 📝 API Changes

### Authentication Endpoints

**POST /api/users/login**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "role": "user" // or "admin"
}
```

**POST /api/users/logout**
No body required. Token in cookie.

**POST /api/users/refreshToken**
No body required. Token in cookie.

### Protected Endpoints
All API endpoints now require authentication except:
- `/api/users/login`
- `/api/users/refreshToken`
- `/api/users/products`
- `/api/users/cms`
- `/api/users/home`

### Admin Endpoints
Require `role: "admin"` in JWT:
- `/api/admin/*`

---

## 🧪 Testing

### Test Login
```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "role": "user"
  }'
```

### Test Protected Route
```bash
curl http://localhost:3000/api/admin/userList \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Test Rate Limiting
Try logging in 6 times with wrong password:
```bash
# Should return 429 Too Many Requests on 6th attempt
```

---

## ⚠️ Important Notes

### For Production
1. **Use Redis for rate limiting** (current implementation is in-memory)
2. **Enable HTTPS** (set NODE_ENV=production)
3. **Set strong database passwords**
4. **Enable database backups**
5. **Monitor logs for security events**

### Client-Side Updates Needed
If you're storing tokens manually in `sessionStorage`, remove that code:
```typescript
// ❌ Remove this
sessionStorage.setItem('access_token', token);

// ✅ Tokens now in httpOnly cookies automatically
// Just use fetch with credentials: 'include'
```

---

## 📚 Documentation

- **AUDIT_SUMMARY.md** - Complete overview of changes
- **SECURITY_FIXES.md** - Detailed security documentation
- **.env.example** - Environment configuration template

---

## 🐛 Troubleshooting

### App won't start
**Error:** "JWT_SECRET environment variable is required"
- **Fix:** Create `.env` file and add JWT_SECRET (see Step 2)

### TypeScript errors
**Error:** Type errors in `.next` folder
- **Fix:** Delete `.next` folder and restart: `rm -rf .next ; npm run dev`

### Login fails
**Error:** "Invalid email or password"
- **Check:** Email and password are correct
- **Check:** User exists in database with correct role
- **Check:** Password was hashed correctly

### 429 Too Many Requests
**Error:** "Too many login attempts"
- **Fix:** Wait 15 minutes or restart server (clears in-memory limit)
- **Note:** In production, use Redis-based limiting

### Unauthorized errors
**Error:** "Unauthorized: No token provided"
- **Check:** Token is being sent in Authorization header
- **Check:** Token hasn't expired (15 minute lifetime)
- **Fix:** Refresh token or log in again

---

## 🎉 You're All Set!

Your application now has:
- ✅ Secure authentication
- ✅ Input validation
- ✅ SQL injection protection
- ✅ Rate limiting
- ✅ File upload security
- ✅ Security headers
- ✅ Proper error handling

**Next:** Review `SECURITY_FIXES.md` for production recommendations!
