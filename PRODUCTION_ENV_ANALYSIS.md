# Production Environment Variables Analysis

## Executive Summary

I've scanned your Next.js repository for production environment variable configuration for Supabase. Here are my findings:

**Key Finding:** Your project uses **PM2 + Nginx** deployment, **NOT Docker/docker-compose** as mentioned in your query.

**Target Variables:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## Repository Scan Results

### ✅ Files Found and Analyzed

1. **`lib/supabaseClient.ts`** - Uses the Supabase env variables
2. **`ecosystem.config.js`** - PM2 configuration (production)
3. **`deploy.sh`** - Deployment script
4. **`ENV_SETUP.md`** - Environment setup documentation
5. **`云主机部署指南.md`** - Chinese deployment guide
6. **`.gitignore`** - Excludes `.env*` files

### ❌ Files NOT Found

- No `docker-compose.yml`
- No `Dockerfile`
- No `.env` or `.env.production` files (gitignored, as expected)
- No systemd service files
- No Caddy configuration

---

## Where Production Environment Variables Are Defined

### 1. **`.env.production` File** (Expected Location)

**File Path:** `/var/www/ailinkxin/.env.production` (on server)

**Status:** 
- ✅ Mentioned in `云主机部署指南.md` (line 130)
- ❌ Not in repository (gitignored, as expected)
- ❓ **Unknown if it exists on your server** - needs verification

**Purpose:** Production environment variables for Next.js

**Usage:** 
- **Production only** - Next.js automatically loads `.env.production` in production mode
- Used during `npm run build` (since `NEXT_PUBLIC_*` vars are build-time)

**Expected Content:**
```env
NODE_ENV=production
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

---

### 2. **PM2 `ecosystem.config.js`** (Current State)

**File:** `ecosystem.config.js` (lines 11-14)

**Status:** 
- ✅ File exists in repository
- ⚠️ **Missing Supabase variables** - only contains:
  ```javascript
  env: {
    NODE_ENV: 'production',
    PORT: 3000
  }
  ```

**Purpose:** Environment variables passed to PM2 process

**Usage:**
- **Production only** - Used when PM2 starts the application
- Available at runtime to the Node.js process
- **Note:** For `NEXT_PUBLIC_*` variables, these need to be available during build time, not just runtime

**Current State:** Does NOT contain Supabase variables

---

### 3. **System Environment Variables** (Possible Location)

**Locations to Check:**
- `/etc/environment` (system-wide)
- `~/.bashrc` (user-specific)
- `~/.bash_profile` (user-specific)
- `~/.profile` (user-specific)

**Status:** Unknown - needs server inspection

**Purpose:** System-level environment variables

**Usage:** Available to all processes if set at system level

---

## Code References to Supabase Variables

The following files reference these environment variables:

1. **`lib/supabaseClient.ts`** (lines 8-9)
   - Reads: `NEXT_PUBLIC_SUPABASE_URL`
   - Reads: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **Warning:** Logs a warning if variables are missing (line 16-19)

2. **`app/playbook/page.tsx`** (multiple locations)
   - Checks for both variables before using Supabase

3. **`app/playbook/[slug]/page.tsx`** (line 32)
   - Checks for both variables

4. **`app/playbook/category/[category]/page.tsx`** (line 32)
   - Checks for both variables

5. **`app/playbook/tag/[tag]/page.tsx`** (line 32)
   - Checks for both variables

---

## Deployment Architecture

Based on the repository files:

```
GitHub → Server (/var/www/ailinkxin) → PM2 → Next.js (port 3000) → Nginx (reverse proxy) → Domain
```

**Not using:**
- ❌ Docker
- ❌ docker-compose
- ❌ Caddy (using Nginx instead)

**Using:**
- ✅ PM2 for process management
- ✅ Nginx for reverse proxy
- ✅ Git for deployment (`deploy.sh` script)

---

## Critical Notes

### ⚠️ Build-Time vs Runtime Variables

**Important:** `NEXT_PUBLIC_*` variables are **embedded at build time**, not runtime!

This means:
1. Variables must be available when running `npm run build`
2. If you change these variables, you **MUST rebuild** the application
3. Simply restarting PM2 won't pick up new `NEXT_PUBLIC_*` values

**To update Supabase variables:**
```bash
# 1. Update .env.production or ecosystem.config.js
# 2. Rebuild the application
npm run build

# 3. Restart PM2
pm2 restart ailinkxin
```

---

## Recommendations

### If Variables Are Missing on Server:

**Option 1: Add to `.env.production`** (Recommended for Next.js)

Create/edit `/var/www/ailinkxin/.env.production`:
```env
NODE_ENV=production
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

Then rebuild:
```bash
cd /var/www/ailinkxin
npm run build
pm2 restart ailinkxin
```

**Option 2: Add to `ecosystem.config.js`**

Edit `ecosystem.config.js`:
```javascript
env: {
  NODE_ENV: 'production',
  PORT: 3000,
  NEXT_PUBLIC_SUPABASE_URL: 'https://your-project.supabase.co',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'your-anon-key-here'
}
```

Then rebuild and restart:
```bash
npm run build
pm2 reload ecosystem.config.js
```

---

## Next Steps

1. **Use the checklist:** See `PRODUCTION_ENV_CHECKLIST.md` for step-by-step inspection guide
2. **SSH into your server:** Follow the checklist to locate where (if anywhere) the variables are set
3. **Document findings:** Note the current state
4. **Fix if needed:** Add variables to appropriate location and rebuild

---

## Summary Table

| Location | File | Status | Purpose | Dev/Prod |
|----------|------|--------|---------|----------|
| `.env.production` | `/var/www/ailinkxin/.env.production` | ❓ Unknown (not in repo) | Next.js production env | **Production** |
| PM2 Config | `ecosystem.config.js` | ⚠️ Missing Supabase vars | PM2 process env | **Production** |
| System Env | `/etc/environment`, `~/.bashrc` | ❓ Unknown | System-wide env | Both |
| `.env.local` | `/var/www/ailinkxin/.env.local` | ❓ Unknown (not in repo) | Next.js local env | **Development** |

**Legend:**
- ✅ Found and configured
- ⚠️ Found but missing variables
- ❓ Unknown (needs server inspection)
- ❌ Not found

---

**Generated:** Based on repository scan
**Deployment Method:** PM2 + Nginx (not Docker)


