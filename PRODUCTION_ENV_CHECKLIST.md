# Production Environment Variables Inspection Checklist

## Overview
This checklist helps you inspect the production environment variables for Supabase on your remote Linux server.

**Target Variables:**
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Note:** Repository shows PM2 + Nginx setup, but you mentioned Docker. This checklist covers **both scenarios**.

---

## 🔍 First: Determine Your Deployment Method

Before checking env vars, determine which deployment method you're actually using:

```bash
# Check if Docker is running
docker ps

# Check if PM2 is running
pm2 status

# Check for docker-compose files
find /var/www -name "docker-compose*.yml" -o -name "docker-compose*.yaml" 2>/dev/null
find ~ -name "docker-compose*.yml" -o -name "docker-compose*.yaml" 2>/dev/null

# Check for PM2 config
ls -la /var/www/ailinkxin/ecosystem.config.js 2>/dev/null
```

**If Docker containers are running:** Follow **Section A: Docker Deployment**  
**If PM2 is running:** Follow **Section B: PM2 + Nginx Deployment**  
**If both:** Check both sections

---

## Section A: Docker Deployment Inspection

### A1: SSH into Your Remote Server

```bash
ssh your-user@your-server-ip
# or
ssh your-user@your-domain.com
```

---

### A2: Find Docker Compose File Location

```bash
# Common locations for docker-compose files
ls -la /var/www/ailinkxin/docker-compose.yml 2>/dev/null
ls -la /var/www/ailinkxin/docker-compose.yaml 2>/dev/null
ls -la /opt/ailinkxin/docker-compose.yml 2>/dev/null
ls -la ~/ailinkxin/docker-compose.yml 2>/dev/null

# Or search for it
find /var/www -name "docker-compose*.yml" -o -name "docker-compose*.yaml" 2>/dev/null
find /opt -name "docker-compose*.yml" -o -name "docker-compose*.yaml" 2>/dev/null
find ~ -name "docker-compose*.yml" -o -name "docker-compose*.yaml" 2>/dev/null
```

**What to Look For:** Location of `docker-compose.yml` or `docker-compose.yaml`

---

### A3: Check Docker Compose File for Environment Variables

```bash
# Navigate to directory with docker-compose file
cd /path/to/docker-compose/directory

# View entire docker-compose file
cat docker-compose.yml

# Specifically check for Supabase env vars
grep -i "SUPABASE" docker-compose.yml

# Check environment section
grep -A 20 "environment:" docker-compose.yml
grep -A 20 "env_file:" docker-compose.yml
```

**What to Look For:**
- `environment:` section with `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `env_file:` section pointing to `.env` or `.env.production` files

**Example locations in docker-compose.yml:**
```yaml
services:
  nextjs:
    environment:
      - NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
    # OR
    env_file:
      - .env.production
```

---

### A4: Check Environment Files Referenced by Docker Compose

```bash
# If docker-compose.yml uses env_file, check those files
cd /path/to/docker-compose/directory

# Check .env.production
cat .env.production 2>/dev/null | grep -i "SUPABASE"

# Check .env
cat .env 2>/dev/null | grep -i "SUPABASE"

# Check .env.local
cat .env.local 2>/dev/null | grep -i "SUPABASE"

# List all .env files
ls -la .env* 2>/dev/null
```

**What to Look For:** Supabase variables in environment files

---

### A5: Check Running Docker Container Environment

```bash
# List running containers
docker ps

# Get container name/ID (usually something like 'ailinkxin' or 'nextjs')
CONTAINER_NAME=$(docker ps --format "{{.Names}}" | grep -i "ailinkxin\|nextjs" | head -1)

# Check container environment variables
docker exec $CONTAINER_NAME env | grep -i "SUPABASE"

# Or inspect the container config
docker inspect $CONTAINER_NAME | grep -A 50 "Env"

# Check container logs for env var warnings
docker logs $CONTAINER_NAME 2>&1 | grep -i "supabase\|environment variables are missing"
```

**What to Look For:**
- Actual environment variables in the running container
- Warning messages about missing Supabase variables

---

### A6: Check Docker Build Arguments (if used)

```bash
# Check Dockerfile for ARG or ENV directives
find /var/www -name "Dockerfile" 2>/dev/null | xargs grep -i "SUPABASE" 2>/dev/null

# Or if docker-compose builds from Dockerfile
cat docker-compose.yml | grep -A 10 "build:" | grep -A 10 "args:"
```

**What to Look For:** Build-time arguments for Supabase variables

---

### A7: Check Caddy/Nginx Reverse Proxy Config (if using)

```bash
# Check Caddy config
sudo cat /etc/caddy/Caddyfile 2>/dev/null | grep -A 20 "ailinkxin\|nextjs"

# Check Nginx config
sudo cat /etc/nginx/sites-available/ailinkxin 2>/dev/null | grep -A 20 "proxy_pass"
sudo cat /etc/nginx/conf.d/ailinkxin.conf 2>/dev/null | grep -A 20 "proxy_pass"
```

**Note:** Reverse proxy configs typically don't contain env vars, but verify the setup.

---

## Section B: PM2 + Nginx Deployment Inspection

### B1: SSH into Your Remote Server

```bash
ssh your-user@your-server-ip
# or
ssh your-user@your-domain.com
```

---

### B2: Navigate to Project Directory

```bash
cd /var/www/ailinkxin
# Verify you're in the right place
pwd
ls -la
```

**Expected Result:** You should see project files including `package.json`, `ecosystem.config.js`, etc.

---

### B3: Check for `.env.production` File

```bash
# Check if .env.production exists
ls -la .env.production

# If it exists, view its contents
cat .env.production

# Or use a safer method to check for Supabase vars
grep -i "SUPABASE" .env.production 2>/dev/null || echo "No Supabase vars found in .env.production"
```

**What to Look For:**
- Does the file exist?
- Does it contain `NEXT_PUBLIC_SUPABASE_URL`?
- Does it contain `NEXT_PUBLIC_SUPABASE_ANON_KEY`?

**Note:** If the file doesn't exist, this might be where you need to add the variables.

---

### B4: Check for `.env.local` File (Development, but check anyway)

```bash
ls -la .env.local
cat .env.local 2>/dev/null | grep -i "SUPABASE" || echo "No .env.local or no Supabase vars"
```

**What to Look For:** This is typically for local dev, but check if it exists and contains production values.

---

### B5: Check PM2 Ecosystem Config

```bash
# View the ecosystem.config.js file
cat ecosystem.config.js

# Specifically check the env section
grep -A 10 '"env":' ecosystem.config.js
```

**What to Look For:**
- Current config only has `NODE_ENV` and `PORT`
- **Missing:** Supabase variables should be added here if not in `.env.production`

**Expected Current Content:**
```javascript
env: {
  NODE_ENV: 'production',
  PORT: 3000
}
```

---

### B6: Check PM2 Process Environment Variables

```bash
# Check PM2 process info (shows runtime env vars)
pm2 show ailinkxin | grep -A 20 "env:"

# Or get detailed process info
pm2 describe ailinkxin

# Alternative: Check PM2 env dump
pm2 env 0
```

**What to Look For:**
- Are `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` listed?
- What values do they have?

---

### B7: Check System Environment Variables

```bash
# Check current shell environment
env | grep -i "SUPABASE"

# Check system-wide environment (if set)
cat /etc/environment | grep -i "SUPABASE" 2>/dev/null || echo "Not in /etc/environment"

# Check user-specific environment
cat ~/.bashrc | grep -i "SUPABASE" 2>/dev/null || echo "Not in ~/.bashrc"
cat ~/.bash_profile | grep -i "SUPABASE" 2>/dev/null || echo "Not in ~/.bash_profile"
cat ~/.profile | grep -i "SUPABASE" 2>/dev/null || echo "Not in ~/.profile"
```

**What to Look For:** System-level environment variables that might be set.

---

### B8: Check Built Next.js Application (Runtime Check)

Since `NEXT_PUBLIC_*` variables are embedded at build time, check the built application:

```bash
# Check if .next directory exists
ls -la .next

# Search for Supabase URL in built files (if accessible)
grep -r "supabase" .next/standalone 2>/dev/null | head -5 || echo "Cannot search built files"

# Better: Check the actual runtime by inspecting the process
```

---

### B9: Check PM2 Logs for Environment Variable Warnings

```bash
# Check recent PM2 logs for any Supabase-related warnings
pm2 logs ailinkxin --lines 100 | grep -i "supabase"

# Or check for the specific warning from supabaseClient.ts
pm2 logs ailinkxin --lines 200 | grep -i "Supabase environment variables are missing"
```

**What to Look For:**
- Warning message: "⚠️ Supabase environment variables are missing"
- This indicates the variables are NOT set correctly

---

### B10: Verify Current Running Process Environment

```bash
# Get the PID of the PM2 process
pm2 pid ailinkxin

# Check the actual process environment (replace PID with actual PID)
PID=$(pm2 pid ailinkxin)
cat /proc/$PID/environ | tr '\0' '\n' | grep -i "SUPABASE"
```

**What to Look For:** The actual environment variables available to the running process.

---

### B11: Check Build-Time Environment (If Rebuilding)

If you need to verify what was available during the last build:

```bash
# Check when .next was last built
ls -ld .next

# Check package.json scripts to see build command
cat package.json | grep -A 5 '"build"'
```

**Note:** `NEXT_PUBLIC_*` variables must be available during `npm run build`, not just at runtime.

---

### B12: Check Nginx Configuration (Not for env vars, but for completeness)

```bash
# View Nginx config (won't have env vars, but good to verify setup)
sudo cat /etc/nginx/sites-available/ailinkxin | grep -i "proxy_pass"

# Or check enabled sites
sudo cat /etc/nginx/sites-enabled/ailinkxin | head -20
```

**Note:** Nginx doesn't pass environment variables, but it's good to verify the reverse proxy setup.

---

---

## Quick One-Liner Checks

### For Docker Deployment:

```bash
# Quick Docker check
CONTAINER=$(docker ps --format "{{.Names}}" | grep -i "ailinkxin\|nextjs" | head -1) && \
echo "=== Docker Container: $CONTAINER ===" && \
docker exec $CONTAINER env 2>/dev/null | grep -i "SUPABASE" || echo "No Supabase vars in container" && \
echo "" && \
echo "=== Docker Compose File ===" && \
(find /var/www /opt ~ -name "docker-compose*.yml" -o -name "docker-compose*.yaml" 2>/dev/null | head -1 | xargs cat 2>/dev/null | grep -i "SUPABASE" || echo "No docker-compose file found or no Supabase vars")
```

### For PM2 + Nginx Deployment:

```bash
cd /var/www/ailinkxin && \
echo "=== .env.production ===" && \
(cat .env.production 2>/dev/null | grep -i "SUPABASE" || echo "File not found or no Supabase vars") && \
echo "" && \
echo "=== PM2 Config ===" && \
(cat ecosystem.config.js | grep -A 10 '"env":' || echo "Config not found") && \
echo "" && \
echo "=== PM2 Process Env ===" && \
(pm2 show ailinkxin 2>/dev/null | grep -A 20 "env:" | grep -i "SUPABASE" || echo "No Supabase vars in PM2 process") && \
echo "" && \
echo "=== System Env ===" && \
(env | grep -i "SUPABASE" || echo "No Supabase vars in current shell")
```

### Universal Check (Tries Both):

```bash
echo "=== Checking Docker ===" && \
(docker ps 2>/dev/null | grep -q . && docker ps --format "{{.Names}}" | head -1 | xargs -I {} docker exec {} env 2>/dev/null | grep -i "SUPABASE" || echo "Docker not running or no containers") && \
echo "" && \
echo "=== Checking PM2 ===" && \
(pm2 status 2>/dev/null | grep -q . && pm2 show ailinkxin 2>/dev/null | grep -A 20 "env:" | grep -i "SUPABASE" || echo "PM2 not running or no Supabase vars") && \
echo "" && \
echo "=== Checking .env.production ===" && \
(cat /var/www/ailinkxin/.env.production 2>/dev/null | grep -i "SUPABASE" || echo "File not found or no Supabase vars")
```

---

## Expected Findings Summary

### For Docker Deployment:

**Most Likely Locations:**
1. **`docker-compose.yml`** - `environment:` section or `env_file:` directive
2. **`.env.production`** or **`.env`** file in the same directory as docker-compose.yml
3. **Dockerfile** - `ENV` directives (less common for NEXT_PUBLIC_* vars)

**What to Check:**
- `docker-compose.yml` file location (could be in `/var/www/ailinkxin/`, `/opt/ailinkxin/`, or elsewhere)
- Environment files referenced by `env_file:` in docker-compose.yml
- Running container's actual environment variables

### For PM2 + Nginx Deployment:

**Most Likely Locations:**
1. **`.env.production`** file in `/var/www/ailinkxin/` (if following the deployment guide)
2. **`ecosystem.config.js`** under the `env:` section

**Current State (Based on Repo):**
- ⚠️ `ecosystem.config.js` does NOT contain Supabase variables (only NODE_ENV and PORT)
- ❓ `.env.production` is gitignored, so we can't see if it exists on the server

### 🔧 **If Variables Are Missing:**

#### For Docker Deployment:

**Option 1: Add to `docker-compose.yml` environment section**
```yaml
services:
  nextjs:
    environment:
      - NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Option 2: Add to `.env.production` and reference in docker-compose.yml**
```yaml
services:
  nextjs:
    env_file:
      - .env.production
```

Then create/edit `.env.production`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Then rebuild and restart:**
```bash
docker-compose down
docker-compose up -d --build
```

#### For PM2 + Nginx Deployment:

**Option 1: Add to `.env.production`**
```bash
cd /var/www/ailinkxin
nano .env.production
# Add:
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**Option 2: Add to `ecosystem.config.js`**
```javascript
env: {
  NODE_ENV: 'production',
  PORT: 3000,
  NEXT_PUBLIC_SUPABASE_URL: 'https://your-project.supabase.co',
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'your-anon-key-here'
}
```

**Then rebuild and restart:**
```bash
npm run build  # IMPORTANT: NEXT_PUBLIC_* vars are build-time!
pm2 restart ailinkxin
# Or reload the config
pm2 reload ecosystem.config.js
```

---

## Important Notes

### Build-Time vs Runtime Variables

**CRITICAL:** `NEXT_PUBLIC_*` variables are **embedded at build time**, not runtime!

- **For Docker:** Variables must be available during `docker build` or when the container starts (if using build-time injection)
- **For PM2:** Variables must be available during `npm run build`

**If you change these variables:**
- **Docker:** Rebuild the image: `docker-compose up -d --build`
- **PM2:** Rebuild the app: `npm run build && pm2 restart ailinkxin`

### Environment Variable Priority (Next.js)

Next.js reads env files in this order (highest to lowest priority):
1. `.env.production.local`
2. `.env.local`
3. `.env.production`
4. `.env`

### Docker vs PM2 Environment Variables

- **Docker:** Environment variables in `docker-compose.yml` or `.env` files are available at container runtime
- **PM2:** Variables in `ecosystem.config.js` are available at runtime. Variables in `.env.production` are read by Next.js automatically.

### Security

- Never commit `.env*` files to git (they're already in `.gitignore`)
- For Docker, consider using Docker secrets or external secret management
- For PM2, ensure `.env.production` has proper file permissions: `chmod 600 .env.production`

---

## Troubleshooting

### If variables are not found anywhere:

1. **Check if Supabase is actually being used:**
   ```bash
   grep -r "NEXT_PUBLIC_SUPABASE" app/ lib/
   ```

2. **Check PM2 logs for errors:**
   ```bash
   pm2 logs ailinkxin --err --lines 50
   ```

3. **Verify the application is actually running:**
   ```bash
   pm2 status
   curl http://localhost:3000
   ```

---

## Next Steps After Inspection

Once you've completed the checklist:

1. **Document your findings:** Note where (if anywhere) the variables are currently set
2. **If missing:** Add them to the appropriate location (`.env.production` or `ecosystem.config.js`)
3. **Rebuild if needed:** Since these are `NEXT_PUBLIC_*` variables, rebuild the app
4. **Restart PM2:** `pm2 restart ailinkxin`
5. **Verify:** Check PM2 logs to ensure no warnings appear

---

**Last Updated:** Based on repository scan  
**Repository Structure:** PM2 + Nginx deployment documented in repo  
**Note:** Checklist covers both Docker and PM2 scenarios since deployment method may differ on server

