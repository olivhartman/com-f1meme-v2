import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import FormData from 'form-data';

// Load environment variables from .env file if it exists
dotenv.config();

const CLOUDINARY_CLOUD_NAME = "f1meme";
const CLOUDINARY_UPLOAD_PRESET = "f1meme";

class CloudinaryUploader {
  constructor() {
    if (!CLOUDINARY_CLOUD_NAME) {
      throw new Error('VITE_CLOUDINARY_CLOUD_NAME environment variable is required');
    }
    if (!CLOUDINARY_UPLOAD_PRESET) {
      throw new Error('VITE_CLOUDINARY_UPLOAD_PRESET environment variable is required');
    }
    
    this.cloudName = CLOUDINARY_CLOUD_NAME;
    this.uploadPreset = CLOUDINARY_UPLOAD_PRESET;
  }

  async uploadFile(filePath, filename) {
    try {
      console.log(`Uploading ${filename} to Cloudinary...`);
      
      // Read file as buffer
      const fileBuffer = fs.readFileSync(filePath);
      
      // Create FormData
      const formData = new FormData();
      formData.append('file', fileBuffer, {
        filename: filename,
        contentType: this.getContentType(filename)
      });
      formData.append('upload_preset', this.uploadPreset);
      formData.append('cloud_name', this.cloudName);

      // Upload to Cloudinary
      const response = await fetch(`https://api.cloudinary.com/v1_1/${this.cloudName}/image/upload`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log(`✅ ${filename} uploaded successfully: ${data.secure_url}`);
      
      return {
        filename,
        cloudinaryUrl: data.secure_url,
        success: true
      };
    } catch (error) {
      console.error(`❌ Failed to upload ${filename}:`, error.message);
      return {
        filename,
        cloudinaryUrl: '',
        success: false,
        error: error.message
      };
    }
  }

  getContentType(filename) {
    const ext = path.extname(filename).toLowerCase();
    const contentTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml'
    };
    return contentTypes[ext] || 'image/jpeg';
  }

  async uploadDirectory(directoryPath) {
    console.log(`📁 Scanning directory: ${directoryPath}`);
    
    const files = fs.readdirSync(directoryPath);
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file)
    );

    console.log(`Found ${imageFiles.length} image files:`, imageFiles);

    const results = [];
    
    for (const filename of imageFiles) {
      const filePath = path.join(directoryPath, filename);
      const result = await this.uploadFile(filePath, filename);
      results.push(result);
      
      // Add a small delay between uploads to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return results;
  }
}

async function main() {
  try {
    console.log('🚀 Starting Cloudinary upload script...');
    console.log('Cloud Name:', CLOUDINARY_CLOUD_NAME);
    console.log('Upload Preset:', CLOUDINARY_UPLOAD_PRESET);
    
    const uploader = new CloudinaryUploader();
    const migPicturesPath = path.join(process.cwd(), 'public', 'assets', 'images', 'mig-pictures');
    
    const results = await uploader.uploadDirectory(migPicturesPath);
    
    console.log('\n📊 Upload Summary:');
    console.log('==================');
    
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    
    console.log(`✅ Successful uploads: ${successful.length}`);
    console.log(`❌ Failed uploads: ${failed.length}`);
    
    if (successful.length > 0) {
      console.log('\n🎉 Successfully uploaded images:');
      successful.forEach(result => {
        console.log(`  ${result.filename}: ${result.cloudinaryUrl}`);
      });
    }
    
    if (failed.length > 0) {
      console.log('\n💥 Failed uploads:');
      failed.forEach(result => {
        console.log(`  ${result.filename}: ${result.error}`);
      });
    }
    
    // Generate a JSON report
    const report = {
      timestamp: new Date().toISOString(),
      totalFiles: results.length,
      successful: successful.length,
      failed: failed.length,
      results: results
    };
    
    console.log('\n📄 Full report saved to cloudinary-upload-report.json');
    fs.writeFileSync('cloudinary-upload-report.json', JSON.stringify(report, null, 2));
    
  } catch (error) {
    console.error('💥 Script failed:', error.message);
    process.exit(1);
  }
}

// Run the script
main();
