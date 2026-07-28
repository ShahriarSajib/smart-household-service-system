# FixMate Deployment Guide

## Easy & Free Options

---

## Option 1: Render (Easiest — Fully Free)

### Prerequisites
- [GitHub](https://github.com) account
- [Render](https://render.com) account (sign up with GitHub)
- [Aiven](https://aiven.io) account (free MySQL)

### Step 1: Push Code to GitHub
```bash
git init
git add .
git commit -m "initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/fixmate.git
git push -u origin main
```

### Step 2: Create Free MySQL Database (Aiven)
1. Go to [Aiven.io](https://console.aiven.io) → Create service → **MySQL**
2. Select **Free plan** (click "Free - $0" tab)
3. Choose a cloud region → **Create service**
4. Once ready, go to **Overview** and note the:
   - Host, Port, Database Name, User, Password

### Step 3: Create Render Web Service
1. Go to [Render Dashboard](https://dashboard.render.com) → **New +** → **Web Service**
2. Connect your GitHub repo
3. Fill in:
   - **Name**: `fixmate`
   - **Region**: choose closest
   - **Branch**: `main`
   - **Runtime**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && node server.js`
   - **Plan**: **Free** ($0/month)
4. Click **Advanced** → **Add Environment Variable**:

| Variable | Value |
|---|---|
| `PORT` | `10000` |
| `DB_HOST` | *(from Aiven)* |
| `DB_USER` | *(from Aiven)* |
| `DB_PASS` | *(from Aiven)* |
| `DB_NAME` | *(defaultdb)* |
| `JWT_SECRET` | *(generate a random string)* |
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_SECURE` | `false` |
| `SMTP_USER` | *your gmail* |
| `SMTP_PASS` | *app password* |
| `SMTP_FROM` | `"FixMate <your-email>"` |

5. Click **Create Web Service**

> **Note**: Free Render services spin down after 15 min of inactivity. They wake on the next request (takes ~30s). For no spin-down, upgrade to $7/mo.

### Step 4: Load Database Schema
```bash
# Install Aiven CLI or use a local MySQL client
mysql -h YOUR_AIVEN_HOST -u USER -p PASSWORD defaultdb < backend/database.sql
```

### Step 5: Done!
Your app is live at `https://fixmate.onrender.com`

---

## Option 2: Railway (Free Credits, No Spin-Down)

### Step 1-2: Same as Option 1 (GitHub + Database)

### Step 3: Deploy on Railway
1. Go to [Railway.app](https://railway.app) → **Start New Project** → **Deploy from GitHub repo**
2. Add environment variables (same as Render table above)
3. Go to **Settings** → **Start Command**: `cd backend && node server.js`
4. Railway gives $5 free credit/month (~$0.002/hr, essentially free for this app)

### Step 4: Load Schema
Use Railway's built-in MySQL plugin instead of Aiven for simplicity:
1. In Railway project → **New** → **Database** → **Add MySQL**
2. Copy connection string from the MySQL plugin's **Connect** tab
3. Use Railway's web terminal or a local client to `source database.sql`

---

## Post-Deployment Checklist

- [ ] Visit `https://your-app-url` — landing page loads?
- [ ] Register a user account — works?
- [ ] Check email verification (check spam)
- [ ] Log in as admin (seed an admin in DB if needed)
- [ ] Test worker registration

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `Cannot connect to database` | Check DB_HOST allows remote connections (Aiven does by default). Verify env vars. |
| Blank page on load | Check browser console for API errors. The free tier might be waking up. |
| Emails not sending | Use Gmail App Password (not regular password). Enable 2FA on the Gmail account first. |
| Port binding error | Render/Railway set `PORT` automatically. Ensure your `.env` doesn't override it. |

---

## URLs

- **Render**: https://dashboard.render.com
- **Railway**: https://railway.app
- **Aiven** (free MySQL): https://aiven.io
- **Gmail App Password**: https://myaccount.google.com/apppasswords
