# 🍷 Vine Route — Wine Trip Planner

An AI-powered wine region itinerary planner that creates driving-optimized routes with ratings, reservation info, and insider tips.

## Quick Deploy to Vercel (5 minutes)

### Step 1: Get your Anthropic API key
1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Create an account or sign in
3. Navigate to **API Keys** in the sidebar
4. Click **Create Key**, copy it somewhere safe

### Step 2: Push to GitHub
1. Create a new repo on [github.com/new](https://github.com/new)
2. Push this code:
```bash
cd wine-planner
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/vine-route.git
git push -u origin main
```

### Step 3: Deploy on Vercel
1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New Project"**
3. Import your `vine-route` repo
4. Before deploying, click **"Environment Variables"** and add:
   - **Key:** `ANTHROPIC_API_KEY`
   - **Value:** your API key from Step 1
5. Click **Deploy**

That's it! Vercel gives you a URL like `vine-route.vercel.app` that anyone can visit.

### Optional: Custom domain
In your Vercel project settings → Domains → add your custom domain.

---

## Run Locally

```bash
# Install dependencies
npm install

# Create .env.local with your key
cp .env.example .env.local
# Edit .env.local and paste your ANTHROPIC_API_KEY

# Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
wine-planner/
├── app/
│   ├── api/
│   │   └── generate-itinerary/
│   │       └── route.js          # Backend API (keeps your key secret)
│   ├── components/
│   │   ├── MapView.js            # Leaflet map with route markers
│   │   └── StopCard.js           # Expandable itinerary stop card
│   ├── globals.css
│   ├── layout.js
│   └── page.js                   # Main planner UI
├── .env.example
├── next.config.js
├── package.json
└── README.md
```

## Cost

Each itinerary generation uses roughly 4,000 tokens (~$0.01–0.03 per request with Claude Sonnet). For personal use or sharing with friends, this is very affordable. If you want to limit usage, you can add rate limiting in `app/api/generate-itinerary/route.js`.
