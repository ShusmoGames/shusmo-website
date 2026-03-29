# Supabase Setup Guide

## Your Database Schema

Your Supabase `games` table has these fields:

| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | Primary key |
| `name` | varchar(255) | Game title |
| `icon_url` | text | Game icon/thumbnail URL |
| `short_description` | text | One-line description |
| `full_description` | text | Complete game description |
| `trailer_url` | text | YouTube trailer URL |
| `google_play_link` | text | Google Play Store link |
| `app_store_link` | text | Apple App Store link |
| `social_links` | jsonb | Social media links (discord, twitter, reddit, youtube) |
| `images` | text[] | Array of screenshot URLs |
| `genre` | varchar(100) | Game genre |
| `created_at` | timestamp | Creation timestamp |

## Setup Instructions

### 1. Get Your Supabase Credentials

1. Go to [https://supabase.com](https://supabase.com)
2. Open your project
3. Go to **Settings** → **API**
4. Copy these two values:
   - **Project URL**
   - **anon/public key**

### 2. Configure Environment Variables

Update the `.env` file in your project root:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Run the Development Server

```bash
npm run dev
```

## Adding Games to Your Database

### Option 1: Via Supabase Dashboard

1. Go to **Table Editor** → **games**
2. Click **"Insert"**
3. Fill in the required fields:
   - **name**: Game title
   - **icon_url**: URL to game icon image
   - **short_description**: Tagline
   - **full_description**: Full description
   - **trailer_url**: YouTube URL (e.g., `https://www.youtube.com/watch?v=VIDEO_ID`)
   - **google_play_link**: Google Play URL
   - **app_store_link**: App Store URL
   - **social_links**: JSON object:
     ```json
     {"discord": "https://discord.gg/xxx", "twitter": "https://twitter.com/xxx"}
     ```
   - **images**: Array of URLs:
     ```json
     ["https://example.com/img1.jpg", "https://example.com/img2.jpg"]
     ```
   - **genre**: Game genre (e.g., "Strategy", "Puzzle", "Racing")

### Option 2: Via SQL Editor

```sql
INSERT INTO games (
  name,
  icon_url,
  short_description,
  full_description,
  trailer_url,
  google_play_link,
  app_store_link,
  social_links,
  images,
  genre
) VALUES (
  'Your Game Name',
  'https://example.com/icon.jpg',
  'A short description',
  'Full game description...',
  'https://www.youtube.com/watch?v=VIDEO_ID',
  'https://play.google.com/store/apps/details?id=xxx',
  'https://apps.apple.com/app/idxxx',
  '{"discord": "#", "twitter": "#"}',
  ARRAY['https://example.com/img1.jpg', 'https://example.com/img2.jpg'],
  'Action'
);
```

## Troubleshooting

### Games not showing?

1. **Check your `.env` file** - Make sure the credentials are correct
2. **Check browser console** - Look for any error messages
3. **Verify data exists** - Go to Supabase Table Editor and confirm games exist
4. **Check RLS policies** - Make sure "Allow public read access" policy exists

### Check RLS Policies

Run this in SQL Editor to verify:

```sql
-- Check if RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'games';

-- Check policies
SELECT * FROM pg_policies WHERE tablename = 'games';
```

If policies are missing, run the `supabase-schema.sql` script.

## Files Modified

- `src/lib/supabase.js` - Supabase client
- `src/hooks/useGames.js` - Custom hooks for fetching data
- `src/pages/Games.jsx` - Games list page
- `src/pages/GameDetails.jsx` - Game details page
- `src/components/GameCard.jsx` - Game card component
- `.env` - Your Supabase credentials
