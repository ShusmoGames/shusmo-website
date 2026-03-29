# Admin Panel Setup Guide

## Overview
The admin panel allows authorized administrators to manage game data (add, edit, delete) with Google authentication.

## Setup Steps

### 1. Enable Google OAuth in Supabase

1. Go to your Supabase Dashboard
2. Navigate to **Authentication** → **Providers**
3. Enable **Google** provider
4. Add your Google OAuth credentials:
   - **Client ID**: Get from [Google Cloud Console](https://console.cloud.google.com/)
   - **Client Secret**: Get from Google Cloud Console
5. Set the redirect URL:
   - Production: `https://your-domain.com/admin`
   - Local: `http://localhost:5173/admin`

### 2. Run the Database Schema

1. Go to Supabase Dashboard → **SQL Editor**
2. Copy the contents of `supabase-schema.sql`
3. Run the SQL script

### 3. Add Your Admin Email

After running the schema, add your Google email to the admin access table:

```sql
INSERT INTO admin_access (email) VALUES ('your-email@example.com');
```

Replace `your-email@example.com` with the Google email you'll use to log in.

### 4. Configure Site URLs

In Supabase Dashboard → **Authentication** → **URL Configuration**:

- **Site URL**: 
  - Local: `http://localhost:5173`
  - Production: `https://your-domain.com`
  
- **Redirect URLs** (additional):
  - `http://localhost:5173/admin`
  - `https://your-domain.com/admin`

### 5. Test the Admin Panel

1. Start your development server: `npm run dev`
2. Navigate to `/admin` or click "Admin" in the navigation
3. Click "Sign in with Google"
4. Log in with your admin Google account
5. You should now have access to the admin dashboard

## Features

### Admin Dashboard
- **View Games**: See all games in a table with icon, name, genre, and slug
- **Add Game**: Create new games with all details
- **Edit Game**: Update existing game information
- **Delete Game**: Remove games (with confirmation)
- **Logout**: Sign out of your admin session

### Game Form Fields
- **Name**: Game title
- **Slug**: URL-friendly identifier (auto-generated from name for new games)
- **Icon URL**: Small icon for the game details page
- **Cover URL**: Large image for game cards
- **Genre**: Game genre/category
- **Short Description**: One-line tagline
- **Full Description**: Complete game description
- **Trailer URL**: YouTube trailer link
- **Google Play Link**: Link to Google Play Store
- **App Store Link**: Link to Apple App Store
- **Social Links**: Discord, Twitter, Reddit, YouTube
- **Screenshots**: Multiple screenshot images

## Security

- **Public Access**: All visitors can view games (no login required)
- **Admin Access**: Only emails in the `admin_access` table can log in
- **RLS Policies**: Database-level security prevents unauthorized modifications

## Adding Multiple Admins

To add more administrators, run:

```sql
INSERT INTO admin_access (email) VALUES 
  ('admin1@example.com'),
  ('admin2@example.com'),
  ('admin3@example.com');
```

## Removing Admin Access

```sql
DELETE FROM admin_access WHERE email = 'admin@example.com';
```

## Troubleshooting

### "Invalid login credentials"
- Make sure your Google email is added to the `admin_access` table
- Check that Google OAuth is properly configured in Supabase

### "Redirect URI mismatch"
- Verify the redirect URLs in Supabase match your domain
- For local development, ensure `http://localhost:5173/admin` is added

### Games not saving
- Check browser console for errors
- Verify RLS policies are correctly set up
- Make sure you're logged in as an admin

### Can't see the Admin link
- The Admin link is visible to everyone, but authentication is required to access the page
