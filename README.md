# F1Meme Frontend

A modern, F1-themed React/TypeScript web app featuring profile management, F1 schedule, community, and wallet integration.

## Features
- **Profile Management:** Users can create and update their profiles, including uploading profile and cover pictures.
- **F1 Schedule:** Displays the next F1 race with a live countdown, and a full schedule page.
- **Community:** Browse and filter community members by membership level, with responsive pagination and wallet info.
- **Wallet Integration:** Connect your Solana wallet and sync your membership level.
- **Airtable Integration:** All user profiles and F1 schedule data are stored in Airtable tables.
- **Cloudinary Image Uploads:** Profile and cover pictures are uploaded to Cloudinary for fast, reliable image hosting.
- **Next Race Caching:** The next race is fetched from the Ergast F1 API and cached in localStorage for instant display and smooth UX.

## Image Upload Service
- **Cloudinary** is used for uploading and hosting profile and cover pictures. When a user uploads an image, it is sent to Cloudinary, which returns a secure URL that is then saved in Airtable and used in the app.
- Cloudinary provides fast, global CDN delivery and automatic image optimization.

## Data Storage
- **Airtable** is used as the backend database for storing user profiles and the F1 schedule. All profile fields, including image URLs and membership level, are saved in Airtable tables.
- The F1 schedule is imported from the Ergast API and saved to Airtable for easy access and management.

## Airtable Table Fields

### Profile Table Fields
- **Name** (single line text)
- **Email** (email)
- **Instagram URL** (single line text)
- **Tiktok URL** (single line text)
- **VK URL** (single line text)
- **Wallet Address** (single line text)
- **Profile Picture** (attachment)
- **Cover Picture** (attachment)
- **Created At** (single line text)
- **Updated At** (single line text)
- **Membership Level** (single line text)

### F1 Schedule Table Fields
- **Race Name** (primary field, single line text)
- **Circuit** (single line text)
- **Created At** (single line text)
- **FP1 Date** (single line text)
- **FP1 Time** (single line text)
- **Location** (single line text)
- **Qualifying Date** (single line text)
- **Qualifying Time** (single line text)
- **Race Day** (single line text)
- **Race Day (Text)** (single line text)
- **Sprint Date** (single line text)
- **Sprint Quali Date** (single line text)
- **Sprint Quali Time** (single line text)
- **Sprint Time** (single line text)

## F1 Schedule & Next Race
- The app fetches the F1 schedule from the [Ergast Developer API](https://ergast.com/mrd/).
- The next race is determined by comparing race dates to the current time, and is cached in localStorage for 5 minutes to ensure instant display.
- If cached data is available, it is shown immediately, and the app updates in the background with fresh data.

## Setup & Environment
- **Environment variables** are required for Airtable and Cloudinary API keys. See `.env.example` for details.
- Install dependencies with `npm install` or `yarn`.
- Start the development server with `npm start` or `yarn dev`.

## Running the Project
```bash
npm install
npm start
# or
yarn
yarn dev
```

## Contributing
- Please ensure all new code is type-safe and follows the existing code style.
- Use environment variables for all API keys and secrets.
- For image uploads, use the provided Cloudinary service in `src/api/cloudinary.ts`.
- For Airtable integration, see `src/api/airtable.ts`.

## Relevant Files
- `src/api/cloudinary.ts` — Cloudinary upload logic
- `src/api/airtable.ts` — Airtable integration
- `src/components/ProfilePage.tsx` — Profile management UI
- `src/components/Hero.tsx` — Next race countdown and details
- `src/pages/schedule.tsx` — Full F1 schedule
- `src/pages/community.tsx` — Community page


