# 🚀 QUICK START GUIDE

## ⚡ Fastest Way to Get Started (5 minutes)

### Step 1: Setup MongoDB Atlas (Cloud) - NO INSTALLATION NEEDED!

**This is the fastest option - skip local MongoDB installation!**

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up (free forever)
3. Create a free M0 cluster (takes 3 mins)
4. Create database user and allow network access
5. Get connection string and update `backend/.env`

**Detailed instructions**: See [MONGODB_SETUP.md](./MONGODB_SETUP.md)

### Step 2: Start Backend

```powershell
cd backend
npm start
```

You should see:
```
✓ MongoDB connected successfully
🚀 Server running on port 5000
```

### Step 3: Scrape Articles (Phase 1)

```powershell
# In a NEW terminal
cd backend
npm run scrape
```

This will scrape 5 articles and save to database.

### Step 4: Enhance Articles (Phase 2)

```powershell
cd backend
npm run enhance
```

This will:
- Search each article on Google ✓
- Scrape top 2 results ✓
- Use Gemini AI to rewrite ✓
- Add citations ✓

**Takes ~2-3 minutes per article**

### Step 5: Start Frontend (Phase 3)

```powershell
# In a NEW terminal
cd frontend
npm run dev
```

Visit: http://localhost:3000

## 🎯 What You'll See

1. **Original Articles** - Scraped from BeyondChats
2. **Enhanced Articles** - AI-improved with citations
3. **Beautiful UI** - Custom design, no templates!

## 📱 Try These Features

- Filter articles (All / Original / Enhanced)
- Click any article to read full content
- See references at the bottom of enhanced articles
- Responsive design - try on different screen sizes!

## 🔧 Terminals You Need Running

Keep these 2 terminals open:

**Terminal 1: Backend**
```powershell
cd backend
npm start
```

**Terminal 2: Frontend**
```powershell
cd frontend
npm run dev
```

## 🐛 Common Issues

### "MongoDB connection error"
- **Solution**: Follow MongoDB Atlas setup in [MONGODB_SETUP.md](./MONGODB_SETUP.md)
- It's free and takes 5 minutes!

### "No articles found"
- **Solution**: Run `npm run scrape` in backend folder first

### "Port 5000 already in use"
- **Solution**: 
```powershell
netstat -ano | findstr :5000
taskkill /PID <PID_NUMBER> /F
```

### Frontend shows errors
- **Solution**: Make sure backend is running on port 5000
- Check backend terminal for errors

## 📚 API Endpoints (for testing)

Test in browser or Postman:

- Get all articles: http://localhost:5000/api/articles
- Health check: http://localhost:5000/api/health
- Original only: http://localhost:5000/api/articles?enhanced=false
- Enhanced only: http://localhost:5000/api/articles?enhanced=true

## ✅ Completion Checklist

- [ ] MongoDB Atlas setup completed
- [ ] Backend running (port 5000)
- [ ] Articles scraped (5 articles)
- [ ] Articles enhanced (AI rewrite)
- [ ] Frontend running (port 3000)
- [ ] Able to view articles in browser

## 🎉 You're Done!

All 3 phases are complete:
- ✅ Phase 1: Scraping + CRUD APIs
- ✅ Phase 2: AI Enhancement Pipeline
- ✅ Phase 3: React Frontend

## 📖 Full Documentation

See [README.md](./README.md) for detailed documentation.

---

**Need help?** Check the main README or MONGODB_SETUP guide.
