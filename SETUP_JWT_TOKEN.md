# 🔑 JWT Token Setup Guide

## ✅ Status: `.env` File Created!

The `.env` file has been created in your project root. Now you need to add your JWT token.

---

## 📝 Next Steps

### 1. Get Your JWT Token

You need the **same JWT token** you used for your previous Day of Week (DOW) discount tests.

**Where to find it:**
- Check your browser's Developer Tools (F12) when logged into the booking engine
- Look in the Network tab for API requests
- Check the Authorization header or JWT parameter
- Or get it from your admin panel/API documentation

### 2. Edit the `.env` File

Open the `.env` file in your project root and replace the placeholders:

```env
# Replace this line:
JWT_TOKEN=your_jwt_token_here

# With your actual token:
JWT_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your_actual_token_here
```

### 3. Add Your Credentials

Also update these fields with your actual credentials:

```env
CUG_USERNAME=your_actual_username
CUG_PASSWORD=your_actual_password
```

---

## 🔍 How to Find Your JWT Token

### Method 1: From Browser (Easiest)

1. Open Chrome/Edge and go to `https://bookings.tripbeast.com`
2. Press `F12` to open Developer Tools
3. Go to the **Network** tab
4. Refresh the page or make a booking search
5. Look for API requests (usually to endpoints like `/api/...`)
6. Click on a request and look in the **Headers** tab
7. Find the `Authorization` header or `jwt` parameter
8. Copy the token (it usually starts with `eyJ...`)

### Method 2: From Previous Tests

If you ran the DOW discount tests successfully before, check:
- Your test scripts
- Browser console logs
- Any saved configuration files

### Method 3: From Admin Panel

1. Log into your Tripbeast admin panel
2. Go to API settings or developer tools
3. Generate or copy your JWT token

---

## 🎯 Quick Edit Command

To edit the `.env` file:

```powershell
# Open in Notepad
notepad .env

# Or open in VS Code
code .env

# Or open in your default editor
start .env
```

---

## ✅ Verify Your Setup

After adding the JWT token, verify it's correct:

```powershell
# Check if .env file has content
Get-Content .env

# Run a quick test
.\run-low-rate-tests.ps1 basic
```

---

## 🚨 Important Notes

1. **JWT tokens expire** - If tests fail with authentication errors, you may need a fresh token
2. **Keep it secret** - Never commit the `.env` file to git (it's already in `.gitignore`)
3. **Same token** - Use the same JWT token you used for your DOW tests

---

## 📞 Need Help?

If you can't find your JWT token:
1. Check your previous test setup
2. Contact your Tripbeast admin
3. Check your API documentation
4. Look in your browser's localStorage/cookies

---

## 🎉 Once Complete

After adding your JWT token, run the tests:

```powershell
.\run-low-rate-tests.ps1
```

All tests should connect successfully! ✅
