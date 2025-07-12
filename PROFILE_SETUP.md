# Profile Page Setup Guide

## Overview
A protected profile page has been added to the F1 Meme application that allows users with connected wallets to manage their social media profiles and upload pictures.

## Features
- ✅ Wallet connection required to access
- ✅ Social media URL management (Instagram, TikTok, VK)
- ✅ Profile picture and cover photo upload
- ✅ Airtable integration for data storage
- ✅ Modern UI inspired by smart home dashboard
- ✅ Responsive design

## Airtable Setup

### 1. Create Airtable Base
1. Go to [Airtable](https://airtable.com) and create a new base
2. Create a table called "Profiles"
3. Add the following fields:
   - `Name` (Single line text)
   - `Instagram URL` (Single line text)
   - `TikTok URL` (Single line text)
   - `VK URL` (Single line text)
   - `Profile Picture` (Attachment) ⭐ **Important: Use Attachment type**
   - `Cover Picture` (Attachment) ⭐ **Important: Use Attachment type**
   - `Wallet Address` (Single line text)
   - `Created At` (Date)
   - `Updated At` (Date)

### 2. Get API Credentials
1. Go to your Airtable account settings
2. Generate an API key
3. Copy your base ID from the API documentation

### 3. Environment Variables
Create a `.env` file in the root directory with:
```
REACT_APP_AIRTABLE_API_KEY=your_airtable_api_key_here
REACT_APP_AIRTABLE_BASE_ID=your_airtable_base_id_here
```

## Usage

### Accessing the Profile Page
1. Connect your wallet on the main page
2. Click the "Profile" button in the navigation (only visible when wallet is connected)
3. Or navigate directly to `/profile`

### Features
- **Profile Picture**: Click the upload button on the profile card to add a profile picture
- **Cover Photo**: Upload a cover photo for your profile
- **Social Links**: Add your Instagram, TikTok, and VK URLs
- **Auto-save**: Data is automatically saved to Airtable when you submit the form

## Technical Details

### Components
- `ProtectedRoute.tsx`: Ensures wallet connection before allowing access
- `ProfilePage.tsx`: Main profile management interface
- `airtable.ts`: Airtable service for data operations

### Routing
- `/`: Main application page
- `/profile`: Protected profile page (requires wallet connection)

### Data Flow
1. User connects wallet
2. Profile data is loaded from Airtable (if exists)
3. User updates profile information
4. Images are converted to base64 and stored
5. All data is saved to Airtable

## Styling
The profile page uses a modern dark theme with:
- Gradient backgrounds
- Glassmorphism effects
- Yellow accent colors matching the F1 theme
- Responsive grid layout
- Smooth animations and transitions

## Security
- Wallet connection required for access
- All data is associated with wallet address
- Protected routes prevent unauthorized access
- Form validation and error handling

## Future Enhancements
- Image optimization and CDN integration
- Profile verification system
- Social media preview cards
- Profile sharing functionality
- Advanced image editing tools 