# 🚀 DEPLOYMENT GUIDE

Quick guide for deploying your BeyondChats application to production.

## 📋 What You'll Deploy

- **Backend**: Node.js API on Render/Railway/Heroku
- **Frontend**: React app on Vercel/Netlify
- **Database**: MongoDB Atlas (already cloud-ready)

---

## Option 1: Quick Deploy (Recommended) ⚡

### Backend: Railway.app (Free Tier)

1. **Sign up**: https://railway.app
2. **New Project** → "Deploy from GitHub repo"
3. **Or use CLI**:
   ```powershell
   npm install -g @railway/cli
   railway login
   cd backend
   railway init
   railway up
   ```
4. **Add Environment Variables**:
   - Go to project → Variables
   - Add: `MONGODB_URI`, `GEMINI_API_KEY`, `SERPAPI_KEY`, `PORT`
5. **Get URL**: `https://your-app.railway.app`

### Frontend: Vercel (Free Tier)

1. **Sign up**: https://vercel.com
2. **New Project** → Import from GitHub
3. **Settings**:
   - Framework Preset: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. **Environment Variable**:
   - Add: `VITE_API_URL=https://your-backend.railway.app`
5. **Update** `frontend/src/services/api.js`:
   ```javascript
   const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
   ```
6. **Deploy**: Auto-deploys on push

---

## Option 2: Render.com (Free Tier)

### Backend on Render

1. **Sign up**: https://render.com
2. **New** → **Web Service**
3. **Connect repository** or deploy manually
4. **Settings**:
   - Name: `beyondchats-backend`
   - Environment: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Instance Type: Free
5. **Environment Variables**:
   ```
   MONGODB_URI=mongodb+srv://...
   GEMINI_API_KEY=AIzaSy...
   SERPAPI_KEY=d4d70...
   PORT=5000
   ```
6. **Deploy**: Get URL like `https://beyondchats-backend.onrender.com`

### Frontend on Render

1. **New** → **Static Site**
2. **Settings**:
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
3. **Environment Variables**:
   ```
   VITE_API_URL=https://beyondchats-backend.onrender.com
   ```

---

## Option 3: All-in-One on Vercel

### Deploy Both on Vercel

1. **Backend as Serverless Functions**:
   - Create `api/` folder in root
   - Move backend logic to serverless functions
   - Each route becomes a function file

2. **Frontend**: Normal Vite deployment

**Note**: Requires refactoring backend to serverless architecture.

---

## Database: MongoDB Atlas Setup

Already configured! Just ensure:

1. **Connection String** in production env variables
2. **Network Access**: Allow all IPs (0.0.0.0/0)
3. **Database User**: Has read/write permissions

---

## Environment Variables Checklist

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/beyondchats
GEMINI_API_KEY=AIzaSyD1PA9p6iU9oMU7tdXGuTn16fKI2IGdKtY
SERPAPI_KEY=d4d70126a68563eba2f3d0643cfca20118bf662319f9a9bdd5380870806ada63
NODE_ENV=production
```

### Frontend
```env
VITE_API_URL=https://your-backend-url.com
```

---

## Pre-Deployment Checklist

### Backend
- [ ] Remove console.logs (or use proper logging)
- [ ] Add rate limiting
- [ ] Enable HTTPS only
- [ ] Set secure CORS origins
- [ ] Add helmet.js for security
- [ ] Handle production errors gracefully

### Frontend
- [ ] Update API URL to production
- [ ] Test build locally (`npm run build`)
- [ ] Check bundle size
- [ ] Add error tracking (Sentry)
- [ ] Test on multiple devices

---

## Quick Security Updates

### Backend: Add to server.js

```javascript
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Security headers
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// CORS for production
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000'
}));
```

Install dependencies:
```powershell
cd backend
npm install helmet express-rate-limit
```

---

## Post-Deployment Steps

1. **Test Production**:
   - Visit frontend URL
   - Check all features work
   - Test article loading
   - Test filtering
   - Check mobile view

2. **Run Scripts**:
   - SSH into backend or use CLI
   - Run: `npm run scrape`
   - Run: `npm run enhance`

3. **Monitor**:
   - Check logs for errors
   - Monitor API usage
   - Check database connections

---

## Custom Domain (Optional)

### Add Custom Domain

**Vercel/Netlify:**
1. Go to Project Settings → Domains
2. Add your domain
3. Update DNS records (they provide instructions)
4. SSL certificate auto-generated

**Railway:**
1. Settings → Domains
2. Add custom domain
3. Update CNAME record
4. SSL auto-configured

---

## Cost Estimates (All Free Tiers)

| Service | Free Tier | Limits |
|---------|-----------|--------|
| MongoDB Atlas | Forever Free | 512MB storage |
| Vercel | Forever Free | 100GB bandwidth |
| Railway | $5 credit/month | ~500 hours |
| Render | Free | 750 hours/month |
| Netlify | Forever Free | 100GB bandwidth |

**Total Cost**: $0/month for this project! 🎉

---

## Scaling Considerations

When your app grows:

1. **Backend**:
   - Upgrade Railway/Render plan
   - Add caching (Redis)
   - Use CDN for assets
   - Implement job queue for enhancements

2. **Database**:
   - Upgrade MongoDB Atlas tier
   - Add indexes for faster queries
   - Implement data archiving

3. **Frontend**:
   - Enable caching
   - Optimize images
   - Code splitting
   - Lazy loading

---

## Continuous Deployment

### Auto-Deploy on Git Push

**Vercel/Netlify:**
- Connect GitHub repository
- Auto-deploys on push to main branch
- Preview deployments for PRs

**Railway/Render:**
- Connect GitHub
- Select branch
- Auto-deploys on push

---

## Monitoring & Analytics

### Add Error Tracking

**Sentry** (Free tier):
```javascript
// Frontend
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "your-sentry-dsn",
  environment: "production"
});
```

**Backend Logging**:
```javascript
// Use winston or pino for structured logging
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
```

---

## Backup Strategy

### Database Backups

**MongoDB Atlas**:
- Go to Cluster → Backup
- Enable Cloud Backups (available in M2+ tiers)
- Or export manually:
  ```powershell
  mongodump --uri="your-connection-string"
  ```

---

## Troubleshooting Deployment

### Common Issues

**Build Fails:**
- Check Node.js version matches local
- Ensure all dependencies in package.json
- Check build logs for specific errors

**API Not Connecting:**
- Verify CORS settings
- Check environment variables
- Ensure backend URL is correct
- Test API endpoint directly

**Database Connection Fails:**
- Check connection string
- Verify network access in Atlas
- Check database user permissions

**Frontend 404 Errors:**
- Check build output directory
- Verify vite.config.js settings
- Check deployment settings

---

## Performance Optimization

### Before Going Live

1. **Frontend**:
   ```powershell
   npm run build
   # Check dist/ folder size
   ```

2. **Optimize Bundle**:
   - Remove unused dependencies
   - Enable minification
   - Use production React build

3. **API Optimization**:
   - Add response caching
   - Compress responses (gzip)
   - Optimize database queries

---

## Support & Maintenance

### Regular Tasks

- **Weekly**:
  - Check error logs
  - Monitor API usage
  - Review database size

- **Monthly**:
  - Update dependencies
  - Review security advisories
  - Optimize performance

- **As Needed**:
  - Run enhancement script for new articles
  - Add new features
  - Fix bugs

---

## 🎉 Ready to Deploy!

Your app is production-ready. Choose your platform and follow the steps above.

**Recommended Stack:**
- Frontend: **Vercel** (easiest, best DX)
- Backend: **Railway** (simple, good free tier)
- Database: **MongoDB Atlas** (already using it)

**Total setup time**: 15-20 minutes

---

Good luck with deployment! 🚀

For issues, check platform documentation:
- Vercel: https://vercel.com/docs
- Railway: https://docs.railway.app
- MongoDB Atlas: https://docs.atlas.mongodb.com
