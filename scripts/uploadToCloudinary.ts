import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';

// Cloudinary configurations
function getEnv(key: string): string | undefined {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  return undefined;
}

const CLOUDINARY_CLOUD_NAME = getEnv('VITE_CLOUDINARY_CLOUD_NAME');
const CLOUDINARY_UPLOAD_PRESET = getEnv('VITE_CLOUDINARY_UPLOAD_PRESET');

interface UploadResult {
  filename: string;
  cloudinaryUrl: string;
  success: boolean;
  error?: string;
}

class CloudinaryUploader {
  private cloudName: string;
  private uploadPreset: string;

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

  async uploadFile(filePath: string, filename: string): Promise<UploadResult> {
    try {
      console.log(`Uploading ${filename} to Cloudinary...`);
      
      // Read file as buffer
      const fileBuffer = readFileSync(filePath);
      
      // Create FormData
      const formData = new FormData();
      const blob = new Blob([fileBuffer]);
      formData.append('file', blob, filename);
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
      console.error(`❌ Failed to upload ${filename}:`, error);
      return {
        filename,
        cloudinaryUrl: '',
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }

  async uploadDirectory(directoryPath: string): Promise<UploadResult[]> {
    console.log(`📁 Scanning directory: ${directoryPath}`);
    
    const files = readdirSync(directoryPath);
    const imageFiles = files.filter(file => 
      /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file)
    );

    console.log(`Found ${imageFiles.length} image files:`, imageFiles);

    const results: UploadResult[] = [];
    
    for (const filename of imageFiles) {
      const filePath = join(directoryPath, filename);
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
    const migPicturesPath = join(process.cwd(), 'public', 'assets', 'images', 'mig-pictures');
    
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
    require('fs').writeFileSync('cloudinary-upload-report.json', JSON.stringify(report, null, 2));
    
  } catch (error) {
    console.error('💥 Script failed:', error);
    process.exit(1);
  }
}

// Run the script if called directly
if (require.main === module) {
  main();
}

export { CloudinaryUploader, type UploadResult };
