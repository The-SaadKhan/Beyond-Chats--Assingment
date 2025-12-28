# BeyondChats Article Intelligence Platform

A full-stack web application that scrapes articles, enhances them using AI, and displays them in a beautiful, responsive interface.

## 🚀 Features

- **Phase 1**: Web scraping from BeyondChats blogs
- **Phase 2**: AI-powered article enhancement using Google Gemini
- **Phase 3**: Modern React frontend with unique design

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud)
- API Keys:
  - Google Gemini API Key
  - SerpAPI Key

## 🛠️ Installation

### Backend Setup

1. Navigate to backend folder:
```powershell
cd backend
```

2. Install dependencies:
```powershell
npm install
```

3. Make sure MongoDB is running:
```powershell
# If using local MongoDB
mongod
```

4. The `.env` file is already configured with your API keys

### Frontend Setup

1. Navigate to frontend folder:
```powershell
cd ..\frontend
```

2. Install dependencies:
```powershell
npm install
```

## 🎯 Usage

### Step 1: Start the Backend Server

```powershell
cd backend
npm start
```

The API will be available at `http://localhost:5000`

### Step 2: Scrape Articles

In a new terminal:
```powershell
cd backend
npm run scrape
```

This will fetch 5 articles from BeyondChats and save them to MongoDB.

### Step 3: Enhance Articles with AI

```powershell
cd backend
npm run enhance
```

This script will:
- Search each article title on Google
- Scrape top 2 ranking articles
- Use Gemini AI to rewrite the article
- Add citations at the bottom

### Step 4: Start the Frontend

In a new terminal:
```powershell
cd frontend
npm run dev
```

Open your browser to `http://localhost:3000`

## 📁 Project Structure

```
├── backend/
│   ├── models/
│   │   └── Article.js          # MongoDB schema
│   ├── routes/
│   │   └── articles.js         # CRUD API routes
│   ├── scripts/
│   │   ├── scraper.js          # Web scraper
│   │   └── enhancer.js         # AI enhancement script
│   ├── server.js               # Express server
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx      # App header
│   │   │   ├── FilterBar.jsx   # Filter controls
│   │   │   ├── ArticleGrid.jsx # Articles grid
│   │   │   ├── ArticleCard.jsx # Article card
│   │   │   ├── ArticleModal.jsx# Full article view
│   │   │   └── Loader.jsx      # Loading spinner
│   │   ├── services/
│   │   │   └── api.js          # API service
│   │   ├── App.jsx
│   │   └── index.css
│   └── package.json
```

## 🔌 API Endpoints

### Articles CRUD

- `GET /api/articles` - Get all articles
  - Query params: `?enhanced=true/false`, `?limit=10`, `?sort=newest/oldest`
- `GET /api/articles/:id` - Get single article
- `GET /api/articles/:id/enhanced` - Get enhanced version of article
- `POST /api/articles` - Create new article
- `PUT /api/articles/:id` - Update article
- `DELETE /api/articles/:id` - Delete article

### Health Check

- `GET /api/health` - Check API status

## 🎨 Frontend Features

- **Dark Mode Design**: Modern, eye-friendly dark theme
- **Responsive Layout**: Works on desktop, tablet, and mobile
- **Filter System**: View all, original, or enhanced articles
- **Modal View**: Full article reading experience
- **Smooth Animations**: Polished UI interactions
- **Live Status Indicator**: Shows API connectivity

## 🧪 Testing

1. Check backend health:
```powershell
curl http://localhost:5000/api/health
```

2. Get all articles:
```powershell
curl http://localhost:5000/api/articles
```

## 🔧 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod`
- Check the connection string in `.env`

### API Key Errors
- Verify your API keys in `.env`
- Check API quota limits

### Port Already in Use
- Change ports in `.env` (backend) or `vite.config.js` (frontend)

## 📝 Notes

- The scraper includes fallback sample data if live scraping fails
- AI enhancement takes ~5 seconds per article
- References are automatically added to enhanced articles
- All dates are formatted in a readable format

## 🌟 Unique Features

- **No Generic Templates**: Custom-designed UI from scratch
- **Human-like Code**: Clean, readable, maintainable code
- **Smart Content Processing**: Markdown rendering in modal
- **Gradient Accents**: Modern purple-pink gradient theme
- **Contextual Indicators**: Visual feedback for enhanced articles

## 🚀 Deployment Ready

The project is structured for easy deployment:
- Backend: Can be deployed to Heroku, Railway, or any Node.js host
- Frontend: Can be deployed to Vercel, Netlify, or any static host
- Database: Use MongoDB Atlas for cloud database

---

Built with ❤️ for BeyondChats Assignment
