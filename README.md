# Shusmo Website

A modern, responsive website for Shusmo game studio, built with React, Vite, and Supabase.

## 🎮 Features

- **Responsive Design** - Beautiful, mobile-first design with Tailwind CSS
- **Dynamic Game Catalog** - Real-time game data from Supabase
- **Admin Dashboard** - Secure game management with Google authentication
- **SEO Optimized** - Meta tags, Open Graph, and Twitter cards
- **Performance** - Code splitting, lazy loading, and optimized builds
- **Custom Domain** - Configured for shusmo.io

## 🚀 Tech Stack

- **Frontend:** React 18 + Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router (Hash Router for GitHub Pages)
- **Backend:** Supabase (PostgreSQL + Auth + Storage)
- **Deployment:** GitHub Pages with CI/CD

## 📁 Project Structure

```
shusmo-website/
├── .github/workflows/
│   └── deploy.yml          # CI/CD pipeline
├── public/
│   ├── 404.html            # SPA fallback for GitHub Pages
│   ├── CNAME               # Custom domain configuration
│   └── *.png               # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── admin/          # Admin-specific components
│   │   ├── GameCard.jsx
│   │   ├── HeroSection.jsx
│   │   ├── NavigationBar.jsx
│   │   ├── ScreenshotsCarousel.jsx
│   │   └── SocialLinks.jsx
│   ├── hooks/              # Custom React hooks
│   │   └── useGames.js     # Games data fetching
│   ├── lib/                # Utilities and configurations
│   │   └── supabase.js     # Supabase client
│   ├── pages/              # Page components
│   │   ├── admin/          # Admin pages
│   │   ├── About.jsx
│   │   ├── GameDetails.jsx
│   │   ├── Games.jsx
│   │   └── Home.jsx
│   ├── App.jsx             # Main app with routing
│   ├── index.css           # Global styles
│   └── main.jsx            # Entry point
├── .env                    # Environment variables (not committed)
├── .env.example            # Environment variables template
├── index.html              # HTML template with SEO
├── package.json            # Dependencies and scripts
├── tailwind.config.js      # Tailwind configuration
└── vite.config.js          # Vite configuration
```

## 🛠️ Development

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/shusmo/shusmo-website.git
   cd shusmo-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your-supabase-project-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

## 📦 Build & Deploy

### Local Build

```bash
npm run build
npm run preview  # Preview production build locally
```

### GitHub Pages Deployment (Automatic)

The project uses GitHub Actions for automatic deployment:

1. Go to your GitHub repository **Settings** → **Secrets and variables** → **Actions**
2. Add the following secrets:
   - `VITE_SUPABASE_URL` - Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

3. Every push to `main` branch will automatically:
   - Install dependencies
   - Build the project
   - Deploy to GitHub Pages

### Manual Deployment

```bash
npm run deploy
```

## 🔐 Admin Access

The admin dashboard (`/#/admin`) is restricted to users with `@shusmo.io` email addresses.

### Supabase Setup for Admin

1. Enable Google OAuth in Supabase:
   - Go to Supabase Dashboard → Authentication → Providers
   - Enable Google and add your credentials

2. Set up Row Level Security (RLS) policies for the `games` table:
   ```sql
   -- Enable RLS
   ALTER TABLE games ENABLE ROW LEVEL SECURITY;

   -- Public can read published games
   CREATE POLICY "Public read published games" ON games
     FOR SELECT USING (published = true);

   -- Admins can do everything
   CREATE POLICY "Admins full access" ON games
     FOR ALL USING (auth.jwt() ->> 'email' LIKE '%@shusmo.io');
   ```

3. Create storage bucket for game images:
   - Name: `game-images`
   - Public: true
   - File size limit: 5MB
   - Allowed MIME types: image/*

## 🎨 Customization

### Brand Colors

Edit `tailwind.config.js`:
```js
colors: {
  'shusmo-yellow': '#FFD700',
  'shusmo-black': '#1A1A1A',
}
```

### Fonts

The project uses Inter font from Google Fonts. Edit `index.html` to change.

## 📱 Routing

The app uses **Hash Router** (`#/path`) for GitHub Pages compatibility:
- Home: `/#/`
- Games: `/#/games`
- Game Details: `/#/games/{slug}`
- About: `/#/about`
- Admin: `/#/admin`

## 🔧 Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run deploy` | Deploy to GitHub Pages |

## 📄 License

Copyright © 2025 Shusmo. All rights reserved.
