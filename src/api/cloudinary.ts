// Cloudinary configuration and upload service
function getEnv(key: string): string | undefined {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  // @ts-ignore
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
    // @ts-ignore
    return import.meta.env[key];
  }
  return undefined;
}

const CLOUDINARY_CLOUD_NAME = getEnv('VITE_CLOUDINARY_CLOUD_NAME');
const CLOUDINARY_UPLOAD_PRESET = getEnv('VITE_CLOUDINARY_UPLOAD_PRESET');

export const cloudinaryService = {
  // Upload image to Cloudinary
  async uploadImage(file: File): Promise<string> {
    try {
      console.log('Uploading image to Cloudinary:', file.name);
      
      if (!CLOUDINARY_CLOUD_NAME) {
        throw new Error('Cloudinary Cloud Name is not configured');
      }
      
      if (!CLOUDINARY_UPLOAD_PRESET) {
        throw new Error('Cloudinary Upload Preset is not configured');
      }

      // Create FormData for upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      formData.append('cloud_name', CLOUDINARY_CLOUD_NAME);

      // Upload to Cloudinary
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Cloudinary upload error:', errorText);
        throw new Error(`Cloudinary upload failed: ${response.status} ${response.statusText} - ${errorText}`);
      }

      const data = await response.json();
      console.log('Cloudinary upload successful:', data.secure_url);
      
      return data.secure_url;
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      throw error;
    }
  },

  // Get Cloudinary configuration status
  getConfigStatus(): { cloudName: boolean; uploadPreset: boolean } {
    return {
      cloudName: !!CLOUDINARY_CLOUD_NAME,
      uploadPreset: !!CLOUDINARY_UPLOAD_PRESET
    };
  }
}; 