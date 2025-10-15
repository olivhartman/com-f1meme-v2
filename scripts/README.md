# Cloudinary Image Upload Script

This script uploads all images from `public/assets/images/mig-pictures/` to Cloudinary and returns their URLs.

## Prerequisites

1. Make sure you have your Cloudinary credentials in your `.env` file:
   ```
   VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
   VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
   ```

2. Install required dependencies (already done):
   ```bash
   npm install dotenv node-fetch form-data
   ```

## Usage

### Method 1: Using npm script (Recommended)
```bash
npm run upload-images
```

### Method 2: Direct execution
```bash
node scripts/uploadImages.js
```

## What the script does

1. **Scans** the `public/assets/images/mig-pictures/` directory
2. **Finds** all image files (jpg, jpeg, png, gif, webp, svg)
3. **Uploads** each image to Cloudinary
4. **Returns** the Cloudinary URLs for each uploaded image
5. **Generates** a detailed report in `cloudinary-upload-report.json`

## Output

The script will:
- Show progress for each upload
- Display success/failure status
- Generate a summary report
- Create a JSON file with all results

## Example Output

```
🚀 Starting Cloudinary upload script...
Cloud Name: your-cloud-name
Upload Preset: your-upload-preset
📁 Scanning directory: /path/to/public/assets/images/mig-pictures
Found 7 image files: ['f1king-cover.jpeg', 'f1king.jpeg', 'mohd.png', ...]

Uploading f1king-cover.jpeg to Cloudinary...
✅ f1king-cover.jpeg uploaded successfully: https://res.cloudinary.com/your-cloud/image/upload/v1234567890/f1king-cover.jpeg

📊 Upload Summary:
==================
✅ Successful uploads: 7
❌ Failed uploads: 0

🎉 Successfully uploaded images:
  f1king-cover.jpeg: https://res.cloudinary.com/your-cloud/image/upload/v1234567890/f1king-cover.jpeg
  f1king.jpeg: https://res.cloudinary.com/your-cloud/image/upload/v1234567890/f1king.jpeg
  ...

📄 Full report saved to cloudinary-upload-report.json
```

## Files Created

- `cloudinary-upload-report.json` - Detailed report with all upload results
- `scripts/uploadImages.js` - The main upload script
- `scripts/uploadToCloudinary.ts` - TypeScript version (alternative)

## Error Handling

The script handles:
- Missing environment variables
- Network errors
- File read errors
- Cloudinary API errors
- Rate limiting (1 second delay between uploads)

## Notes

- The script adds a 1-second delay between uploads to avoid rate limiting
- Only image files are processed (jpg, jpeg, png, gif, webp, svg)
- The original files are not modified or deleted
- All results are logged to the console and saved to a JSON report
